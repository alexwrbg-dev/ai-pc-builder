import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AMAZON_ASIN, AMAZON_MISSING } from "@/data/amazon";
import { CATALOG } from "@/lib/catalog";
import { amazonUrl } from "@/lib/affiliate";
import { getOffers, parseItem, resetAmazonCache } from "@/lib/amazon-api";

describe("fiches Amazon du catalogue", () => {
  it("chaque code correspond à une pièce et a le bon format", () => {
    const ids = new Set(CATALOG.map((c) => c.id));
    for (const [id, asin] of Object.entries(AMAZON_ASIN)) {
      expect(ids.has(id), id).toBe(true);
      expect(asin, id).toMatch(/^B[0-9A-Z]{9}$/);
    }
  });
  it("aucune fiche n'est partagée par deux pièces", () => {
    const asins = Object.values(AMAZON_ASIN);
    expect(new Set(asins).size).toBe(asins.length);
  });
  it("toutes les pièces ont une fiche ou sont listées comme manquantes", () => {
    for (const c of CATALOG) expect(Boolean(c.asin) || AMAZON_MISSING.includes(c.id), c.id).toBe(true);
  });
  it("le lien va droit sur la fiche produit, avec le tag", () => {
    const c = CATALOG.find((x) => x.asin)!;
    expect(amazonUrl(c, "monsite-21")).toBe(`https://www.amazon.fr/dp/${c.asin}?tag=monsite-21`);
    expect(amazonUrl({ brand: "be quiet!", model: "Pure Rock 3" }, "")).toContain("/s?k=");
  });
});

const item = (asin: string, amount: number) => ({
  asin,
  detailPageURL: `https://www.amazon.fr/dp/${asin}?tag=t-21`,
  images: { primary: { large: { url: `https://m.media-amazon.com/images/I/${asin}.jpg` } } },
  offersV2: { listings: [
    { price: { money: { amount: amount + 50, currency: "EUR", displayAmount: "x" } }, condition: { value: "New" }, isBuyBoxWinner: false },
    { price: { money: { amount, currency: "EUR", displayAmount: `${amount},00 €` } }, condition: { value: "New" }, isBuyBoxWinner: true, availability: { type: "IN_STOCK", message: "En stock" } },
  ] },
});

describe("API Creators", () => {
  beforeEach(() => {
    resetAmazonCache();
    vi.stubEnv("AMAZON_CREATORS_CLIENT_ID", "id");
    vi.stubEnv("AMAZON_CREATORS_CLIENT_SECRET", "secret");
    vi.stubEnv("AMAZON_PARTNER_TAG", "t-21");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("garde l'offre neuve mise en avant", () => {
    const o = parseItem(item("B000000001", 899));
    expect(o).toMatchObject({ price: 899, displayPrice: "899,00 €", inStock: true, availability: "En stock" });
    expect(o.image).toContain("m.media-amazon.com");
  });

  it("sans identifiants, ne fait aucun appel", async () => {
    vi.stubEnv("AMAZON_CREATORS_CLIENT_ID", "");
    const f = vi.fn();
    expect(await getOffers(["B000000001"], f as unknown as typeof fetch)).toEqual({});
    expect(f).not.toHaveBeenCalled();
  });

  it("demande par lots de 10, réutilise le jeton et le cache", async () => {
    const calls: { url: string; body: any; headers: any }[] = [];
    const f = vi.fn(async (url: string, init: any) => {
      const body = JSON.parse(init.body);
      calls.push({ url, body, headers: init.headers });
      if (url.includes("/auth/o2/token")) return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }));
      return new Response(JSON.stringify({ itemResults: { items: body.itemIds.map((a: string) => item(a, 100)) } }));
    });
    const asins = Array.from({ length: 12 }, (_, i) => `B0000000${String(i).padStart(2, "0")}`);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const res = await getOffers(asins, f as unknown as typeof fetch);
    expect(Object.keys(res)).toHaveLength(12);
    const tokenCalls = calls.filter((c) => c.url.includes("token"));
    const itemCalls = calls.filter((c) => c.url.includes("getItems"));
    expect(tokenCalls).toHaveLength(1);
    expect(tokenCalls[0].url).toContain("amazon.co.uk");
    expect(itemCalls.map((c) => c.body.itemIds.length)).toEqual([10, 2]);
    expect(itemCalls[0].headers["x-marketplace"]).toBe("www.amazon.fr");
    expect(itemCalls[0].body).toMatchObject({ marketplace: "www.amazon.fr", partnerTag: "t-21" });
    // Deuxième demande dans l'heure : tout vient du cache.
    await getOffers(asins.slice(0, 3), f as unknown as typeof fetch);
    expect(calls).toHaveLength(3);
    vi.useRealTimers();
  });

  it("une panne de l'API ne fait rien échouer", async () => {
    const f = vi.fn(async () => new Response("non", { status: 500 }));
    expect(await getOffers(["B000000001"], f as unknown as typeof fetch)).toEqual({});
  });
});
