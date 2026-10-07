"use client";
import { useState } from "react";

export default function ChatBox({ selection, onApply }: { selection: Record<string, string>; onApply: (s: Record<string, string>) => void }) {
  const [msg, setMsg] = useState("Remplace le GPU par une 4070 SUPER.");
  const [log, setLog] = useState<{ role: string; content: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, selection }) });
      const j = await res.json();
      setLog((l) => [...l, { role: "user", content: msg }, { role: "assistant", content: j.reply }]);
      if (j.selection) onApply(j.selection);
    } finally { setBusy(false); }
  }

  return (
    <div>
      <div aria-live="polite" style={{ display: "grid", gap: 8, marginBottom: 10 }}>
        {log.map((m, i) => <p key={i} style={{ fontSize: 14 }}><strong>{m.role === "user" ? "Vous" : "IA"} :</strong> {m.content}</p>)}
        {log.length === 0 && <p style={{ color: "#93a0c4", fontSize: 14 }}>Exemples : « Pourquoi ce CPU ? » • « Économise 200 € » • « Plus silencieux » • « Remplace le GPU par une 4070 SUPER »</p>}
      </div>
      <div className="prompt-row">
        <input className="input" value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Message à l'assistant" />
        <button className="btn" onClick={send} disabled={busy || !msg}>{busy ? "…" : "Envoyer"}</button>
      </div>
    </div>
  );
}
