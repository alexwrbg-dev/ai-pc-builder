import AiStudio from "@/components/AiStudio";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata({ title: "AI PC Builder — Décris ton PC, l'IA le construit" });

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Quel PC veux-tu construire&nbsp;?</h1>
        <p>
          Décris le PC dont tu rêves. L&apos;IA le construit, <strong>vérifie chaque composant
          avec un moteur déterministe</strong>, l&apos;optimise pour ton budget et te montre
          où acheter les pièces — en 3 profils : Best Value, Balanced, Max Performance.
        </p>
        <AiStudio />
      </section>
      <section className="grid3">
        <div className="card"><h3>✓ Compatibilité prouvée</h3><p>Socket, DDR, formats, longueurs GPU, connecteurs, puissance — 15+ règles, zéro guess du LLM.</p><a href="/builder">Tester le configurateur →</a></div>
        <div className="card"><h3>◐ Prix comparés</h3><p>Plusieurs marchands par composant, meilleur prix mis en avant, historique et alertes.</p><a href="/price-alerts">Créer une alerte →</a></div>
        <div className="card"><h3>⬢ Visualisation 3D</h3><p>Boîtier, GPU, RAM, refroidissement, RGB — modèles génériques étiquetés, rotation/zoom.</p><a href="/builder">Voir la 3D →</a></div>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2>Guides PC populaires</h2>
        <div className="grid3">
          <a href="/pc/pc-gamer-1000-euros">PC gamer 1000 €</a>
          <a href="/pc/pc-gamer-1500-euros">PC gamer 1500 €</a>
          <a href="/pc/pc-4k">PC 4K</a>
        </div>
      </section>
    </div>
  );
}
