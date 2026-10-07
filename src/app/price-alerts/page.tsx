"use client";
import { useState } from "react";

export default function PriceAlertsPage() {
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState("600");
  const [done, setDone] = useState<string | null>(null);
  function save() {
    try {
      const arr = JSON.parse(localStorage.getItem("aipcb-alerts") ?? "[]");
      arr.push({ componentId: "gpu-rtx4070s", targetPrice: Number(target), email, at: new Date().toISOString() });
      localStorage.setItem("aipcb-alerts", JSON.stringify(arr));
      setDone(`Alerte enregistrée (navigateur, démo) : RTX 4070 SUPER sous ${target} € → ${email || "notification web"}. Prod : email via provider configuré.`);
    } catch { setDone("Stockage indisponible."); }
  }
  return (
    <div>
      <h1>Alertes prix</h1>
      <p style={{ color: "#93a0c4" }}>« Prévenez-moi quand cette RTX passe sous 600 €. » MVP local ; prod : worker + email/web push (voir ARCHITECTURE.md).</p>
      <div className="card" style={{ display: "grid", gap: 10, maxWidth: 480 }}>
        <label>Composant<select className="select" disabled><option>RTX 4070 SUPER 12GB (démo)</option></select></label>
        <label>Seuil (€)<input className="input" value={target} onChange={(e) => setTarget(e.target.value)} inputMode="numeric" /></label>
        <label>Email (optionnel)<input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" /></label>
        <button className="btn" onClick={save}>Créer l&apos;alerte</button>
        {done && <p role="status">{done}</p>}
      </div>
    </div>
  );
}
