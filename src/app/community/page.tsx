export const metadata = { title: "Communauté" };

async function getData() {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  try {
    const r = await fetch(`${base}/api/community`, { cache: "no-store" });
    return await r.json();
  } catch { return { builds: [] }; }
}

export default async function Page() {
  const data = await getData();
  return (
    <div>
      <h1>Communauté</h1>
      <p style={{ color: "#93a0c4" }}>Configurations partagées (démo). Likes, commentaires et signalements branchés sur Prisma en prod.</p>
      <div className="grid2">
        {(data.builds ?? []).map((b: { slug: string; title: string; likes: number; budget: number }) => (
          <article key={b.slug} className="card">
            <h3><a href={`/config/${b.slug}`}>{b.title}</a></h3>
            <p>♥ {b.likes} • Budget ~{b.budget} € • <span className="pill-warn">démo</span></p>
          </article>
        ))}
      </div>
    </div>
  );
}
