import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Studio from "@/components/Studio";
import { CATALOG, PRICE_DATE } from "@/lib/catalog";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata({ title: "AI PC Builder — Décris ton PC, on en tire les plans" });

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const STEPS = [
  { n: "01", title: "Tu décris", text: "Budget, usage, jeux, couleur, silence : en une phrase, comme tu le dirais à un ami qui s'y connaît." },
  { n: "02", title: "On calcule", text: "Toutes les combinaisons du catalogue sont essayées. Un moteur de règles écarte celles qui ne s'assemblent pas : socket, longueur de carte, connecteurs, puissance." },
  { n: "03", title: "Tu vois le résultat", text: "La configuration s'assemble en 3D, à l'échelle, avec les cotes réelles. Tu modifies une pièce, tout est revérifié." },
];

const GUIDES = [
  { href: "/pc/pc-gamer-1000-euros", label: "PC gamer", budget: "1 000 €" },
  { href: "/pc/pc-gamer-1500-euros", label: "PC gamer", budget: "1 500 €" },
  { href: "/pc/pc-gamer-2000-euros", label: "PC gamer", budget: "2 000 €" },
];

export default function Home() {
  const verified = CATALOG.filter((c) => c.confidence === "VERIFIED").length;
  const month = new Date(PRICE_DATE).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
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

      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Méthode</b></span>
          <h2>Trois étapes, et un moteur qui vérifie que tout s&apos;emboîte</h2>
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

      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Catalogue</b></span>
          <h2>{CATALOG.length} pièces en vente aujourd&apos;hui</h2>
          <div className="draw-rule" />
        </Reveal>
        <div className="grid3">
          <Reveal i={0}><div className="sheet step" style={{ height: "100%" }}>
            <span className="price">{CATALOG.length}</span>
            <p className="muted">composants actuels : processeurs, cartes graphiques, cartes mères, mémoire, stockage, alimentations, boîtiers, refroidissement.</p>
            <a href="/composants">Parcourir le catalogue →</a>
          </div></Reveal>
          <Reveal i={1}><div className="sheet step" style={{ height: "100%" }}>
            <span className="price">{verified}</span>
            <p className="muted">fiches dont les dimensions et connecteurs ont été relus sur la documentation du fabricant. Les autres reposent sur des specs publiques.</p>
          </div></Reveal>
          <Reveal i={2}><div className="sheet step" style={{ height: "100%" }}>
            <span className="price">{month}</span>
            <p className="muted">date du relevé des prix. Ils bougent vite, surtout la mémoire : le prix affiché chez le marchand fait foi.</p>
          </div></Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal className="section-head">
          <span className="label"><b>Guides</b></span>
          <h2>Ce qu&apos;on peut monter, budget par budget</h2>
          <div className="draw-rule" />
        </Reveal>
        <div className="grid3">
          {GUIDES.map((g, k) => (
            <Reveal key={g.href} i={k}>
              <a className="sheet step" href={g.href}>
                <span className="label">{g.label}</span>
                <span className="price">{g.budget}</span>
                <span>Voir les configurations →</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
