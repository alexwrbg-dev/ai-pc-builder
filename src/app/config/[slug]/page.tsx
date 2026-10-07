import { redirect } from "next/navigation";

// Ancienne adresse de partage : on renvoie vers le configurateur, qui lit la configuration dans le lien.
export default function Page({ params }: { params: { slug: string } }) {
  redirect(`/builder?c=${encodeURIComponent(params.slug)}`);
}
