import { QRCodeSVG } from "qrcode.react";
import { buildJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `Config ${params.slug}` };
}

export default function Page({ params, searchParams }: { params: { slug: string }; searchParams: { s?: string } }) {
  const url = `/config/${params.slug}`;
  const jsonLd = buildJsonLd({ name: `Configuration ${params.slug}`, price: null, url });
  return (
    <div>
      <h1>Configuration partagée</h1>
      <p style={{ color: "#93a0c4" }}>URL partageable + Open Graph + QR code. <span className="pill-warn">Aperçu démo</span></p>
      <div className="card">
        <p>Slug : <code>{params.slug}</code></p>
        {searchParams.s && <pre className="debug">{searchParams.s.slice(0, 500)}</pre>}
        <p><a className="btn-ghost" href={searchParams.s ? `/builder?s=${encodeURIComponent(searchParams.s)}` : "/builder"}>Ouvrir dans le configurateur</a></p>
        <div style={{ background: "#fff", display: "inline-block", padding: 8 }}>
          <QRCodeSVG value={url} size={128} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
