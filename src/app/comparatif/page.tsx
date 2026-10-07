export const metadata = { title: "Comparatif" };
export default function Page() {
  return (
    <div>
      <h1>Comparatif : RTX 4070 SUPER vs RX 7800 XT</h1>
      <table className="table">
        <thead><tr><th></th><th>4070 SUPER 12GB</th><th>7800 XT 16GB</th></tr></thead>
        <tbody>
          <tr><td>VRAM</td><td>12GB GDDR6X</td><td>16GB GDDR6</td></tr>
          <tr><td>TDP (démo)</td><td>220W</td><td>263W</td></tr>
          <tr><td>1440p Cyberpunk (estimation démo)</td><td>~82 FPS</td><td>~78 FPS</td></tr>
          <tr><td>Atouts</td><td>DLSS 3, RT, efficacité</td><td>16GB VRAM, prix (démo ~499€)</td></tr>
        </tbody>
      </table>
      <p style={{ fontSize: 13, color: "#93a0c4" }}>Valeurs démo — branchez les benchmarks mesurés via /api/benchmarks avant indexation à grande échelle. Pas de pages pauvres auto-générées.</p>
    </div>
  );
}
