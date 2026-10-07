export const metadata = { title: "Guides PC" };
export default function Page() {
  return (
    <div>
      <h1>Guides PC</h1>
      <div className="grid3">
        <a className="card" href="/pc/pc-gamer-1000-euros">PC gamer 1000 €</a>
        <a className="card" href="/pc/pc-gamer-1500-euros">PC gamer 1500 €</a>
        <a className="card" href="/pc/pc-gamer-2000-euros">PC gamer 2000 €</a>
        <a className="card" href="/pc/pc-1440p">PC 1440p</a>
        <a className="card" href="/pc/pc-4k">PC 4K</a>
        <a className="card" href="/comparatif/rtx-4070-super-vs-rx-7800-xt">4070 SUPER vs 7800 XT</a>
      </div>
    </div>
  );
}
