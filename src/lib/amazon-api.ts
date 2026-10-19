// Client de l'API Creators d'Amazon (remplaçante de PA-API 5, arrêtée en 2026).
// Côté serveur uniquement : les identifiants ne doivent jamais partir dans le navigateur.
//
// Ce que l'API fournit pour une fiche : le prix affiché par Amazon, la disponibilité, la photo officielle
// et l'adresse de la fiche avec le tag d'affiliation. Accès : compte Partenaires Amazon validé
// (au moins 10 ventes qualifiées sur 30 jours), puis identifiants créés dans le Partenaires Central.
//
// Règles d'Amazon respectées ici (« Best Programming Practices ») :
// - prix et disponibilité gardés 1 heure au plus, photo et lien 24 heures au plus ;
// - jeton d'accès réutilisé pendant sa durée de vie (1 heure) ;
// - 10 fiches au plus par requête, et pas plus d'une requête par seconde au départ.

export interface AmazonOffer {
  asin: string;
  /** Prix en euros, absent si la fiche n'a pas d'offre neuve. */
  price: number | null;
  /** Texte de prix tel qu'Amazon le formate (« 899,90 € »). */
  displayPrice: string | null;
  availability: string | null;
  inStock: boolean;
  image: string | null;
  url: string | null;
  /** Heure du relevé, en millisecondes : à afficher à côté du prix. */
  fetchedAt: number;
}

const OFFER_TTL = 60 * 60 * 1000;
const MEDIA_TTL = 24 * 60 * 60 * 1000;
const MARKETPLACE = "www.amazon.fr";
/** amazon.fr dépend de la région Europe (identifiants en version 3.2). */
const TOKEN_URL = process.env.AMAZON_CREATORS_TOKEN_URL || "https://api.amazon.co.uk/auth/o2/token";
const API_URL = process.env.AMAZON_CREATORS_API_URL || "https://creatorsapi.amazon/catalog/v1/getItems";

const RESOURCES = [
  "itemInfo.title",
  "images.primary.large",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.condition",
  "offersV2.listings.isBuyBoxWinner",
];

export function amazonConfig() {
  const clientId = (process.env.AMAZON_CREATORS_CLIENT_ID ?? "").trim();
  const clientSecret = (process.env.AMAZON_CREATORS_CLIENT_SECRET ?? "").trim();
  const partnerTag = (process.env.AMAZON_PARTNER_TAG ?? process.env.NEXT_PUBLIC_AMAZON_TAG ?? "").trim();
  return { clientId, clientSecret, partnerTag, enabled: Boolean(clientId && clientSecret && partnerTag) };
}

// ---------- Jeton d'accès ----------
let token: { value: string; until: number } | null = null;

async function accessToken(fetcher: typeof fetch): Promise<string> {
  if (token && token.until > Date.now() + 60_000) return token.value;
  const { clientId, clientSecret } = amazonConfig();
  const res = await fetcher(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "creatorsapi::default" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Amazon : jeton refusé (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  token = { value: data.access_token, until: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return token.value;
}

// ---------- Lecture de la réponse ----------
interface RawMoney { amount?: number; currency?: string; displayAmount?: string }
interface RawListing {
  price?: { money?: RawMoney };
  availability?: { type?: string; message?: string };
  condition?: { value?: string };
  isBuyBoxWinner?: boolean;
}
interface RawItem {
  asin: string;
  detailPageURL?: string;
  images?: { primary?: { large?: { url?: string } } };
  offersV2?: { listings?: RawListing[] };
}

/** Garde l'offre neuve mise en avant par Amazon (« buy box »), sinon la première offre neuve. */
export function parseItem(item: RawItem, now = Date.now()): AmazonOffer {
  const listings = item.offersV2?.listings ?? [];
  const fresh = listings.filter((l) => !l.condition?.value || l.condition.value === "New");
  const best = fresh.find((l) => l.isBuyBoxWinner) ?? fresh[0];
  const money = best?.price?.money;
  const type = best?.availability?.type ?? null;
  return {
    asin: item.asin,
    price: typeof money?.amount === "number" && money.currency === "EUR" ? money.amount : null,
    displayPrice: money?.displayAmount ?? null,
    availability: best?.availability?.message ?? null,
    inStock: type === "IN_STOCK" || type === "IN_STOCK_SCARCE",
    image: item.images?.primary?.large?.url ?? null,
    url: item.detailPageURL ?? null,
    fetchedAt: now,
  };
}

// ---------- Cache et file d'attente ----------
const cache = new Map<string, AmazonOffer>();
let lastCall = 0;
let queue: Promise<unknown> = Promise.resolve();

/** Une requête à la fois, espacées d'au moins 1,1 s : la limite de départ est d'une requête par seconde. */
function paced<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastCall + 1100 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCall = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}

async function fetchBatch(asins: string[], fetcher: typeof fetch): Promise<AmazonOffer[]> {
  const { partnerTag } = amazonConfig();
  const bearer = await accessToken(fetcher);
  const res = await fetcher(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
    body: JSON.stringify({
      itemIds: asins, itemIdType: "ASIN", marketplace: MARKETPLACE, partnerTag,
      condition: "New", languagesOfPreference: ["fr_FR"], resources: RESOURCES,
    }),
    cache: "no-store",
  });
  if (res.status === 401) token = null;
  if (!res.ok) throw new Error(`Amazon : requête refusée (${res.status})`);
  const data = (await res.json()) as { itemResults?: { items?: RawItem[] } };
  const now = Date.now();
  return (data.itemResults?.items ?? []).map((i) => parseItem(i, now));
}

/**
 * Offres Amazon pour une liste d'ASIN. Ce qui est en cache depuis moins d'une heure est resservi tel quel ;
 * le reste est demandé par lots de 10. Une fiche introuvable ou une panne de l'API ne fait rien échouer :
 * la pièce garde simplement son prix indicatif.
 */
export async function getOffers(asins: string[], fetcher: typeof fetch = fetch): Promise<Record<string, AmazonOffer>> {
  const out: Record<string, AmazonOffer> = {};
  if (!amazonConfig().enabled) return out;
  const now = Date.now();
  const missing: string[] = [];
  for (const asin of new Set(asins)) {
    const hit = cache.get(asin);
    if (hit && now - hit.fetchedAt < OFFER_TTL) out[asin] = hit;
    else missing.push(asin);
  }
  for (let i = 0; i < missing.length; i += 10) {
    const batch = missing.slice(i, i + 10);
    try {
      const offers = await paced(() => fetchBatch(batch, fetcher));
      for (const o of offers) { cache.set(o.asin, o); out[o.asin] = o; }
    } catch (err) {
      console.warn(String(err));
      // Photo et lien restent valables 24 h : on peut les resservir même si le prix a expiré.
      for (const asin of batch) {
        const old = cache.get(asin);
        if (old && now - old.fetchedAt < MEDIA_TTL) out[asin] = { ...old, price: null, displayPrice: null, availability: null, inStock: false };
      }
    }
  }
  return out;
}

/** Pour les tests. */
export function resetAmazonCache() {
  cache.clear(); token = null; lastCall = 0; queue = Promise.resolve();
}
