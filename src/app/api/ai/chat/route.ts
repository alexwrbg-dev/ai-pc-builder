import { NextResponse } from "next/server";
import { ChatSchema } from "@/lib/validation";
import { parseRequirements, recommendBuild } from "@/lib/ai-orchestrator";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";
import { byId } from "@/lib/demo-data";

// POST /api/ai/chat { message, selection } — modifie la config via actions structurées
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "message invalide" }, { status: 400 });
    const { message, selection = {} } = parsed.data;
    const t = message.toLowerCase();
    const next = { ...selection };
    const actions: string[] = [];

    // Remplacement GPU/CPU explicite : "remplace le gpu par 4070 / 7800 xt..."
    const gpuHit = ["4060", "4070", "7800", "4090"].find((k) => t.includes(k));
    if ((t.includes("remplace") || t.includes("change") || t.includes("mets") || t.includes("mettre")) && t.includes("gpu") && gpuHit) {
      const map: Record<string, string> = { "4060": "gpu-rtx4060", "4070": "gpu-rtx4070s", "7800": "gpu-rx7800xt", "4090": "gpu-rtx4090" };
      next.GPU = map[gpuHit]; actions.push(`GPU → ${byId(map[gpuHit])?.model}`);
    }
    if (t.includes("économ") || t.includes("moins cher") || t.includes("budget") || t.includes("200")) {
      // Optimisation budget : GPU un cran en dessous + SSD 1TB
      if (next.GPU === "gpu-rtx4090") { next.GPU = "gpu-rtx4070s"; actions.push("GPU → RTX 4070 SUPER (~-1150 € démo)"); }
      else if (next.GPU === "gpu-rtx4070s") { next.GPU = "gpu-rx7800xt"; actions.push("GPU → RX 7800 XT"); }
      next.SSD_NVME = "ssd-1tb"; actions.push("SSD → 1TB");
    }
    if ((t.includes("blanc") || t.includes("white")) ) actions.push("Préférence blanc notée (dataset démo sans coloris — à valider en boutique)");
    if (t.includes("silenc") || t.includes("bruit")) { next.AIO = "aio-360"; delete next.CPU_COOLER; actions.push("Refroidissement → AIO 360mm (silence)"); }

    // Questions "pourquoi" : explication factuelle depuis les specs
    if (t.includes("pourquoi") && !actions.length) {
      const cpu = next.CPU ? byId(next.CPU) : undefined;
      const gpu = next.GPU ? byId(next.GPU) : undefined;
      return NextResponse.json({
        reply: `CPU ${cpu ? `${cpu.brand} ${cpu.model}` : "?"} choisi pour son rapport perf/prix sur le socket ${(cpu?.specs as {socket?:string})?.socket ?? "?"} ; GPU ${gpu ? `${gpu.brand} ${gpu.model}` : "?"} calibré pour votre résolution/budget. Compatibilité vérifiée par le moteur, pas par moi.`,
        actions: [], selection: next, compat: checkCompatibility(next), price: buildPrice(next),
      });
    }
    // Optimisation globale sur demande
    if ((t.includes("optimise") || t.includes("fps") || t.includes("performances")) && !actions.length) {
      const req0 = parseRequirements(message);
      const { selection: s } = recommendBuild({ ...req0, budget: 1500 }, "max");
      return NextResponse.json({ reply: "Voilà une variante optimisée performances (moteur re-vérifié).", actions: [" rebuild max-perf"], selection: s, compat: checkCompatibility(s), price: buildPrice(s) });
    }

    const compat = checkCompatibility(next);
    const price = buildPrice(next);
    const reply = actions.length
      ? `C'est fait : ${actions.join(" • ")}. ${compat.status === "compatible" ? "🟢 Compatible (moteur)." : "🔴 " + compat.issues.map((i) => i.message).join(" ")} ${price.total ? `Total démo : ~${price.total} €.` : ""}`
      : "Je peux modifier votre config (ex : « remplace le GPU par une 4070 SUPER », « économise 200 € », « plus silencieux »). Dites-moi quoi changer.";
    return NextResponse.json({ reply, actions, selection: next, compat, price });
  } catch {
    return NextResponse.json({ error: "Requête illisible" }, { status: 400 });
  }
}
