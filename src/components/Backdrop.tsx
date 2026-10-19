// Décor fixe derrière toutes les pages : lueurs qui dérivent lentement, quadrillage de plan qui s'estompe
// vers les bords, et pistes de circuit imprimé parcourues par des impulsions lumineuses.
// Tout est en CSS et SVG, sans script : rien à calculer pendant la navigation.

/** Pistes de circuit tracées une fois pour toutes (coordonnées dans un cadre 1600 × 1000). */
function traces(): { d: string; len: number; delay: number; dur: number }[] {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const out: { d: string; len: number; delay: number; dur: number }[] = [];
  for (let i = 0; i < 26; i++) {
    // Départ sur un bord, puis segments horizontaux / verticaux avec des coudes à 45°, comme sur une carte mère.
    const fromLeft = i % 2 === 0;
    let x = fromLeft ? -20 : 1620;
    let y = 60 + rnd() * 880;
    let d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    let len = 0;
    const dir = fromLeft ? 1 : -1;
    for (let k = 0; k < 4; k++) {
      const run = 80 + rnd() * 260;
      x += dir * run;
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      len += run;
      const turn = (rnd() - 0.5) * 160;
      x += dir * Math.abs(turn);
      y += turn;
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      len += Math.abs(turn) * Math.SQRT2;
    }
    out.push({ d, len, delay: rnd() * 14, dur: 7 + rnd() * 9 });
  }
  return out;
}

const TRACES = traces();

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="bd-glow bd-glow-a" />
      <div className="bd-glow bd-glow-b" />
      <div className="bd-glow bd-glow-c" />
      <div className="bd-grid" />
      <svg className="bd-traces" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        {TRACES.map((t, i) => (
          <g key={i}>
            <path d={t.d} className="bd-trace" />
            <path
              d={t.d} className="bd-pulse"
              style={{ strokeDasharray: `60 ${Math.round(t.len + 200)}`, ["--len" as string]: `${Math.round(t.len + 260)}`, animationDelay: `${t.delay.toFixed(1)}s`, animationDuration: `${t.dur.toFixed(1)}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="bd-vignette" />
    </div>
  );
}
