import Builder from "@/components/Builder";

export const metadata = { title: "Configurateur 3D" };

export default function Page() {
  return (
    <>
      <div className="page-head" style={{ paddingBottom: 0 }}>
        <span className="label"><b>Planche 03</b> — Configurateur</span>
        <h2>Pièce par pièce, vérifié en direct</h2>
        <p className="lede">Clique sur une ligne pour changer la pièce. Les références qui ne s&apos;assembleraient pas sont signalées avant que tu les choisisses.</p>
      </div>
      <Builder />
    </>
  );
}
