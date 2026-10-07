export const metadata = { title: "Profil" };
const BADGES = ["First Build", "Budget King", "1000€ Master", "4K Monster", "Community Favorite"];
export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <h1>@{params.username}</h1>
      <p style={{ color: "#93a0c4" }}>Profil public : builds, likes, followers, badges. Auth + Prisma en prod (RBAC : users normaux ≠ admin).</p>
      <div className="card"><h3>Badges</h3><p>{BADGES.map((b) => <span key={b} className="pill-ok" style={{ marginRight: 6 }}>{b}</span>)}</p></div>
    </div>
  );
}
