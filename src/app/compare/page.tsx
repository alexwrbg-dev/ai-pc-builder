"use client";
import { useState } from "react";

export default function ComparePage() {
  const [out, setOut] = useState<{ verdict: string; A: { price: { total: number | null }; score: { total: number } }; B: { price: { total: number | null }; score: { total: number } } } | null>(null);
  async function run() {
    const a = { CPU: "cpu-r5-7600", GPU: "gpu-rtx4060", MOTHERBOARD: "mb-b650", RAM: "ram-32d5", SSD_NVME: "ssd-1tb", PSU: "psu-450", CASE: "case-nzxt", CPU_COOLER: "cooler-ak400" };
    const b = { CPU: "cpu-r7-7800x3d", GPU: "gpu-rtx4070s", MOTHERBOARD: "mb-b650", RAM: "ram-32d5", SSD_NVME: "ssd-2tb", PSU: "psu-850", CASE: "case-fractal", AIO: "aio-360" };
    const r = await fetch("/api/ai/compare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ a, b }) }).then((x) => x.json());
    setOut(r);
  }
  return (
    <div>
      <h1>Comparateur de configurations</h1>
      <p style={{ color: "#93a0c4" }}>Build A (value 1080p) vs Build B (7800X3D + 4070 SUPER). Prix démo, scores /100, FPS estimés.</p>
      <button className="btn" onClick={run}>Lancer la comparaison (données démo)</button>
      {out && (
        <div className="card" style={{ marginTop: 16 }}>
          <p><strong>{out.verdict}</strong></p>
          <table className="table"><thead><tr><th></th><th>Build A</th><th>Build B</th></tr></thead>
            <tbody>
              <tr><td>Prix démo</td><td>{out.A.price.total} €</td><td>{out.B.price.total} €</td></tr>
              <tr><td>Score global</td><td>{out.A.score.total}/100</td><td>{out.B.score.total}/100</td></tr>
            </tbody></table>
          <p style={{ fontSize: 13, color: "#93a0c4" }}>Gagnant déterminé par score global, puis prix, puis FPS estimés — jamais par le LLM seul.</p>
        </div>
      )}
    </div>
  );
}
