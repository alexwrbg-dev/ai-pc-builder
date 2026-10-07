import { AMAZON_DISCLOSURE, AMAZON_TAG } from "@/lib/affiliate";

export const metadata = { title: "Affiliation" };

export default function Page() {
  return (
    <>
      <div className="page-head"><span className="label"><b>Transparence</b></span><h2>Liens d&apos;achat et affiliation</h2></div>
      <div className="prose">
        <p>Chaque pièce est accompagnée d&apos;un lien vers Amazon.fr. Ces liens servent à trouver le produit : le site n&apos;affiche pas les prix d&apos;Amazon, seulement des prix indicatifs relevés séparément.</p>
        <p><strong>État actuel :</strong> {AMAZON_TAG
          ? "les liens portent un identifiant d'affiliation. Un achat fait après avoir suivi un lien peut rapporter une commission au site, sans surcoût pour toi."
          : "aucun identifiant d'affiliation n'est configuré. Les liens sont de simples liens, sans commission."}</p>
        {AMAZON_TAG && <p>{AMAZON_DISCLOSURE}</p>}
        <p>Les configurations proposées sont calculées par l&apos;optimiseur à partir des caractéristiques et des prix. Aucune commission n&apos;entre dans ce calcul.</p>
      </div>
    </>
  );
}
