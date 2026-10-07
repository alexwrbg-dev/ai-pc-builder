import { Suspense } from "react";
import BuilderClient from "@/components/BuilderClient";

export const metadata = { title: "Configurateur manuel" };

export default function Page() {
  return <Suspense fallback={<p>Chargement…</p>}><BuilderClient /></Suspense>;
}
