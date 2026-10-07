export function generateStaticParams() {
  return [{ slug: "pc-gamer-1000-euros" }, { slug: "pc-gamer-1500-euros" }, { slug: "pc-gamer-2000-euros" }, { slug: "pc-1440p" }, { slug: "pc-4k" }];
}

const GUIDES: Record<string, { title: string; body: string; budget: string }> = {
  "pc-gamer-1000-euros": { title: "PC gamer ~1000 € : 1440p équilibré", budget: "1000", body: "Cible 1440p : Ryzen 5 7600 + RX 7800 XT + 32GB DDR5 + 1TB NVMe. Vérifié moteur. Prix démo." },
  "pc-gamer-1500-euros": { title: "PC gamer ~1500 € : 1440p haut de gamme", budget: "1500", body: "7800X3D + RTX 4070 SUPER + 32GB DDR5-6000. Le sweet spot 1440p/144Hz. Prix démo." },
  "pc-gamer-2000-euros": { title: "PC gamer ~2000 € : 4K d'entrée", budget: "2000", body: "7800X3D + 7900 XTX/4080 SUPER + 850W ATX 3.0. Prix démo." },
  "pc-1440p": { title: "PC 1440p : le guide", budget: "1300", body: "La 1440p demande 12GB+ de VRAM en 2026. Visez 4070 SUPER / 7800 XT minimum." },
  "pc-4k": { title: "PC 4K : le guide", budget: "2500", body: "La 4K exige 16GB+ VRAM et 850W+. RTX 4090 / 7900 XTX. Estimations FPS marquées." },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const g = GUIDES[params.slug];
  return { title: g ? g.title : "Guide PC" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const g = GUIDES[params.slug];
  if (!g) return <div><h1>Guide introuvable</h1><a href="/pc">Retour aux guides</a></div>;
  return (
    <div>
      <h1>{g.title}</h1>
      <p>{g.body}</p>
      <p><a className="btn" href={`/?q=${encodeURIComponent(`PC à ${g.budget} € gaming`)}`}>Générer cette config avec l&apos;IA</a></p>
      <p style={{ fontSize: 13, color: "#93a0c4" }}>Page éditoriale à valeur ajoutée (pas de contenu dupliqué auto-généré). Données prix : démo.</p>
    </div>
  );
}
