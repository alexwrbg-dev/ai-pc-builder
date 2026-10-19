import type { CSSProperties, ReactNode } from "react";
import PartThumb from "@/components/PartThumb";
import Reveal from "@/components/Reveal";
import Studio from "@/components/Studio";
import { CATALOG, PRICE_DATE, byCategory, byId, encodeSelection, fullName } from "@/lib/catalog";
import { GUIDES } from "@/lib/guides";
import { recommendAll } from "@/lib/optimizer";
import { formatEUR } from "@/lib/pricing";
import { baseMetadata } from "@/lib/seo";
import { CATEGORIES, type Component } from "@/lib/types";

export const metadata = baseMetadata({ title: "AI PC Builder — Décris ton PC, on en tire les plans" });

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Petites icônes au trait, dans le style des plans. */
const ICON: Record<string, ReactNode> = {
  socket: <><rect x="5" y="5" width="14" height="14" rx="1" /><path d="M8 8h8v8H8z M5 9H3 M5 15H3 M21 9h-2 M21 15h-2 M9 5V3 M15 5V3 M9 21v-2 M15 21v-2" /></>,
  ruler: <><path d="M3 15 15 3l6 6L9 21z" /><path d="M7 11l2 2 M10 8l2 2 M13 5l2 2 M5 13l1 1" /></>,
  height: <><path d="M12 3v18 M8 7l4-4 4 4 M8 17l4 4 4-4" /><path d="M3 21h18" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  plug: <><path d="M9 2v6 M15 2v6 M6 8h12v4a6 6 0 0 1-12 0z M12 18v4" /></>,
  board: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M7 8h5v5H7z M15 8v8 M18 8v8 M7 16h5" /></>,
  ram: <><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M6 8v8 M10 8v8 M14 8v8 M18 8v8 M4 16v3 M20 16v3" /></>,
  fan: <><circle cx="12" cy="12" r="9" /><path d="M12 12c0-4 2-6 4-6 M12 12c4 0 6 2 6 4 M12 12c0 4-2 6-4 6 M12 12c-4 0-6-2-6-4" /></>,
};

const CHECKS = [
  { icon: "socket", title: "Socket et BIOS", text: "Le processeur entre dans la carte mère, et le BIOS livré le reconnaît : sinon, on te le dit avant l'achat." },
  { icon: "ram", title: "Mémoire", text: "DDR4 ou DDR5 selon la carte, nombre d'emplacements, et hauteur des barrettes sous le ventirad." },
  { icon: "ruler", title: "Longueur de la carte graphique", text: "Comparée à la place réelle dans le boîtier, au millimètre, cotes à l'appui dans la 3D." },
  { icon: "height", title: "Hauteur du ventirad", text: "Mesurée face au dégagement annoncé par le fabricant du boîtier, vitre fermée." },
  { icon: "fan", title: "Radiateurs", text: "Un watercooling 360 ou 420 mm ne passe que là où le boîtier l'accepte : dessus, façade ou côté." },
  { icon: "bolt", title: "Puissance", text: "Consommation réelle en pointe (pas le TDP marketing), plus une marge pour les pics de la carte graphique." },
  { icon: "plug", title: "Connecteurs d'alimentation", text: "Câbles PCIe 8 broches ou 16 broches 12V-2x6 : l'alimentation doit avoir ce que la carte réclame." },
  { icon: "board", title: "Formats", text: "ATX, Micro-ATX, Mini-ITX, E-ATX : la carte mère et l'alimentation doivent tenir dans le boîtier choisi." },
];

const STEPS = [
  { n: "01", title: "Tu décris", text: "Budget, usage, jeux, couleur, silence : en une phrase, comme à un ami qui s'y connaît. Ou tu choisis pièce par pièce." },
  { n: "02", title: "On calcule", text: "Toutes les paires processeur × carte graphique du catalogue sont essayées, complétées, vérifiées. On garde les meilleures sous ton budget." },
  { n: "03", title: "Tu vois, tu ajustes", text: "La configuration s'assemble en 3D à l'échelle. Change une pièce : compatibilité, prix et performances sont recalculés." },
];

const FAQ = [
  { q: "Les prix sont-ils à jour ?", a: "Ce sont des prix indicatifs relevés sur les comparateurs français à la date affichée. Les prix de la mémoire et des cartes graphiques bougent vite : le prix affiché chez le marchand au moment de l'achat fait foi. Dès que l'API d'Amazon est branchée, les prix Amazon s'affichent en direct, avec l'heure du relevé." },
  { q: "Comment sont vérifiées les compatibilités ?", a: "Par un moteur de règles, pas par une IA : chaque règle compare des dimensions et des caractéristiques relevées sur les fiches des fabricants (socket, longueur, hauteur, connecteurs, puissance…). Le résultat est le même à chaque fois, et chaque alerte explique quoi changer." },
  { q: "La 3D, c'est une photo des produits ?", a: "Non. C'est un rendu à l'échelle : dimensions, couleurs, nombre et place des ventilateurs, éclairage relevés pour chaque pièce. Les formes restent génériques. Survole une pièce pour voir sa fiche, et sa photo officielle quand elle est disponible." },
  { q: "Le site gagne-t-il de l'argent sur mes achats ?", a: "Les liens d'achat peuvent être des liens affiliés : le marchand reverse une petite commission, sans changer ton prix. Le choix des pièces n'en dépend pas : l'optimiseur ne connaît que les prix, les caractéristiques et les performances." },
  { q: "Je n'ai jamais monté de PC, c'est faisable ?", a: "Oui : une configuration validée ici s'assemble avec un tournevis. Quand une étape demande de l'attention, par exemple une mise à jour du BIOS avant d'installer le processeur, le moteur le signale avec la configuration." },
];

/** Repères du marché calculés sur le catalogue, à la date du relevé. */
function market() {
  const ram32 = byCategory("RAM").filter((r) => r.specs.type === "DDR5" && r.specs.capacityGB === 32).sort((a, b) => a.price - b.price)[0];
  const gpu1440 = byCategory("GPU").filter((g) => g.specs.perfIndex >= 100).sort((a, b) => a.price - b.price)[0];
  const gpuEntry = byCategory("GPU").sort((a, b) => a.price - b.price)[0];
  const white = CATALOG.filter((c) => c.finish === "white").length;
  return [
    ram32 && { value: formatEUR(ram32.price), label: "le kit 32 Go DDR5 le moins cher", detail: fullName(ram32), href: `/composants/${ram32.id}` },
    gpu1440 && { value: formatEUR(gpu1440.price), label: "pour une carte graphique taillée pour le 1440p", detail: fullName(gpu1440), href: `/composants/${gpu1440.id}` },
    gpuEntry && { value: formatEUR(gpuEntry.price), label: "la carte graphique d'entrée de gamme", detail: fullName(gpuEntry), href: `/composants/${gpuEntry.id}` },
    { value: String(white), label: "pièces en version blanche", detail: "boîtiers, cartes graphiques, mémoire, refroidissement…", href: "/composants?c=CASE" },
  ].filter(Boolean) as { value: string; label: string; detail: string; href: string }[];
}

/** Trois configurations prêtes, recalculées sur le catalogue au moment de la construction du site. */
function readyBuilds() {
  return GUIDES.filter((g) => g.kicker === "PC gamer").slice(0, 3).map((g) => {
    // La configuration la plus complète qui tient dans le budget.
    const rec = [...recommendAll(g.requirements)].sort((x, y) => y.total - x.total)[0];
    if (!rec) return null;
    const parts = CATEGORIES.map((s) => (rec.selection[s] ? byId(rec.selection[s]!) : undefined)).filter((c): c is Component => Boolean(c));
    return { guide: g, rec, parts };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));
}

export default function Home() {
  const verified = CATALOG.filter((c) => c.confidence === "VERIFIED").length;
  const month = new Date(PRICE_DATE).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const ready = readyBuilds();
  const facts = market();
  return (
    <>
      <Studio>
        <span className="label fade-up" style={i(0)}><b>Planche 01</b> — Configurateur de PC sur mesure</span>
        <h1>
          <span className="line"><span style={i(0)}>Décris ton PC.</span></span>
          <span className="line"><span style={i(1)}><em>On en tire les plans.</em></span></span>
        </h1>
        <p className="lede fade-up" style={i(2)}>
          Donne ton budget et ce que tu veux en faire. Tu obtiens des configurations qui s&apos;assemblent vraiment,
          chiffrées aux prix de {month}, et montées en 3D à l&apos;échelle.
        </p>
      </Studio>

      {/* Ce que le moteur vérifie : la vraie valeur du site, montrée concrètement */}
      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Vérifications</b> — avant que tu commandes</span>
          <h2>Huit erreurs de montage qu&apos;on attrape pour toi</h2>
          <p className="lede">Une pièce incompatible, c&apos;est un retour colis et une semaine perdue. Chaque configuration passe ces contrôles, et la 3D montre les cotes qui posent problème.</p>
          <div className="draw-rule" />
        </Reveal>
        <div className="grid4">
          {CHECKS.map((c, k) => (
            <Reveal key={c.title} i={k % 4}>
              <div className="sheet check">
                <svg className="check-icon" viewBox="0 0 24 24" aria-hidden="true">{ICON[c.icon]}</svg>
                <h3>{c.title}</h3>
                <p className="muted small">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Méthode</b></span>
          <h2>Trois étapes, aucune approximation</h2>
          <div className="draw-rule" />
        </Reveal>
        <div className="grid3">
          {STEPS.map((s, k) => (
            <Reveal key={s.n} i={k}>
              <div className="sheet step" style={{ height: "100%" }}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Configurations prêtes, calculées sur le catalogue du jour */}
      {ready.length > 0 && (
        <section className="section">
          <Reveal className="section-head">
            <span className="label"><b>Prêtes à monter</b> — calculées aux prix de {month}</span>
            <h2>Ce que ton budget achète vraiment</h2>
            <div className="draw-rule" />
          </Reveal>
          <div className="grid3">
            {ready.map(({ guide, rec, parts }, k) => {
              const cpu = parts.find((p) => p.category === "CPU");
              const gpu = parts.find((p) => p.category === "GPU");
              const fps = rec.fps[0];
              return (
                <Reveal key={guide.slug} i={k}>
                  <div className="sheet ready">
                    <div className="ready-top">
                      <span className="label">{guide.kicker} · {guide.title.replace(/^.* à /, "")}</span>
                      <span className="price">{formatEUR(rec.total)}</span>
                    </div>
                    <div className="ready-thumbs">
                      {parts.filter((p) => ["CASE", "GPU", "COOLER", "RAM"].includes(p.category)).map((p) => <PartThumb key={p.id} part={p} className="thumb-sm" />)}
                    </div>
                    <ul className="ready-list small">
                      {cpu && <li><span className="muted">Processeur</span> {fullName(cpu)}</li>}
                      {gpu && <li><span className="muted">Carte graphique</span> {fullName(gpu)}</li>}
                      {fps && <li><span className="muted">{fps.game}</span> ≈ {fps.fps} images/s en {rec.resolution}</li>}
                    </ul>
                    <div className="chips">
                      <a className="btn btn-sm" href={`/builder?c=${encodeURIComponent(encodeSelection(rec.selection))}`}>Voir en 3D <span className="arrow" aria-hidden="true">→</span></a>
                      <a className="btn-ghost btn-sm" href={`/pc/${guide.slug}`}>Le guide</a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Repères du marché */}
      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Le marché</b> — {month}</span>
          <h2>{CATALOG.length} pièces en vente, des prix qui bougent</h2>
          <p className="lede">La mémoire a fortement augmenté cette année : c&apos;est souvent elle, plus que la carte graphique, qui fait déborder un budget. Repères tirés du catalogue :</p>
          <div className="draw-rule" />
        </Reveal>
        <div className="grid4">
          {facts.map((f, k) => (
            <Reveal key={f.label} i={k}>
              <a className="sheet stat" href={f.href}>
                <span className="price">{f.value}</span>
                <span>{f.label}</span>
                <span className="muted small">{f.detail}</span>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>
          {verified} fiches sur {CATALOG.length} ont leurs dimensions et connecteurs relus sur la documentation du fabricant. <a href="/composants">Parcourir le catalogue →</a>
        </p>
      </section>

      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Questions</b></span>
          <h2>Ce qu&apos;on nous demande</h2>
          <div className="draw-rule" />
        </Reveal>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q} className="sheet">
              <summary><h3>{f.q}</h3></summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="sheet cta">
            <div className="stack" style={{ gap: 8 }}>
              <span className="label"><b>À toi</b></span>
              <h2>Ton PC, vérifié pièce par pièce</h2>
              <p className="muted">Décris-le en une phrase en haut de page, ou pars d&apos;une pièce que tu as déjà en tête.</p>
            </div>
            <div className="chips">
              <a className="btn" href="#besoin">Décrire mon PC <span className="arrow" aria-hidden="true">→</span></a>
              <a className="btn-ghost" href="/builder">Choisir pièce par pièce</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
