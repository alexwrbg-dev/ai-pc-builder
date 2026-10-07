export const metadata = { title: "Transparence affiliation" };
export default function Page() {
  return (
    <div>
      <h1>Transparence affiliation</h1>
      <div className="card">
        <p>Certains liens vers les marchands peuvent générer une commission pour le site, <strong>sans surcoût pour vous</strong>.</p>
        <p>Les recommandations restent indépendantes des commissions. Les placements sponsorisés, s&apos;ils existent un jour, seront <strong>clairement identifiés</strong> et jamais présentés comme des recommandations indépendantes.</p>
        <p><strong>État actuel :</strong> aucun marchand affilié configuré — aucun lien affilié n&apos;est généré. Les prix affichés sont des <strong>données de démonstration</strong>.</p>
        <p>Configuration : variable <code>AFFILIATE_MERCHANTS</code> + table <code>Merchant</code> (voir AFFILIATE_SYSTEM.md).</p>
      </div>
    </div>
  );
}
