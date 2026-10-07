export const metadata = { title: "Admin — tableau de bord" };
// Protégé par RBAC en prod (middleware + role ADMIN). Ici : UI + endpoints prêts, données démo.
const STATS = [
  ["Utilisateurs", "— (brancher Prisma)"], ["Builds publiés", "—"],
  ["Clics affiliés", "0 (aucun marchand actif)"], ["Revenus estimés", "0 €"],
  ["Recherches populaires", "1440p, 1500€, silencieux (démo)"], ["Usage API IA", "heuristic: 100% offline"],
];
export default function Page() {
  return (
    <div>
      <h1>Admin <span className="pill-err">RBAC requis en prod</span></h1>
      <div className="grid3">
        {STATS.map(([k, v]) => <div key={k} className="card"><h3>{k}</h3><p>{v}</p></div>)}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Gestion</h2>
        <ul>
          <li>Composants : import JSON/CSV/XML via <code>POST /api/admin/import</code> (à brancher, voir DATA_PIPELINE.md)</li>
          <li>Marchands / prix / benchmarks / signalements / utilisateurs</li>
          <li>Modération : signalements + règles déterministes + modération IA optionnelle</li>
        </ul>
      </div>
    </div>
  );
}
