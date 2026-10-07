export const metadata = { title: "Informations légales" };
export default function Page() {
  return (
    <div>
      <h1>Informations légales</h1>
      <div className="card"><h2>Mentions</h2><p>Éditeur : à compléter. Contact : via /contact. Hébergement : à compléter au déploiement.</p></div>
      <div className="card" style={{ marginTop: 12 }}><h2>Confidentialité</h2><p>Analytics maison sans tracker tiers, aucun PII collecté par défaut. Détails : voir SECURITY.md et DATABASE.md (table AnalyticsEvent).</p></div>
      <div className="card" style={{ marginTop: 12 }}><h2>CGU</h2><p>Contenus communautaires modérés. Les estimations (FPS, bruit, prix démo) ne sont pas contractuelles.</p></div>
      <div className="card" style={{ marginTop: 12 }}><h2>Cookies</h2><p>Aucun cookie marketing. Session/auth + préférences uniquement.</p></div>
    </div>
  );
}
