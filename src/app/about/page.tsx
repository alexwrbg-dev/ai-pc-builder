export const metadata = { title: "À propos" };

export default function Page() {
  return (
    <>
      <div className="page-head"><span className="label"><b>À propos</b></span><h2>Comment fonctionne le site</h2></div>
      <div className="prose">
        <p>AI PC Builder transforme une demande écrite en configurations de PC complètes. Trois briques travaillent l&apos;une après l&apos;autre.</p>
        <h2>Le catalogue</h2>
        <p>Chaque pièce est décrite par ses caractéristiques utiles à l&apos;assemblage : socket, dimensions en millimètres, connecteurs, puissance. Les prix sont <strong>indicatifs</strong>, relevés à la main à une date affichée en bas de page.</p>
        <h2>Le moteur de compatibilité</h2>
        <p>Un jeu de règles écrites à la main vérifie que les pièces vont ensemble. <strong>Aucune intelligence artificielle n&apos;intervient dans ce verdict</strong> : la même configuration donne toujours le même résultat, et chaque refus est expliqué.</p>
        <h2>L&apos;optimiseur</h2>
        <p>Il essaie toutes les combinaisons processeur et carte graphique du catalogue, complète chacune avec les pièces adaptées les moins chères, et garde la meilleure sous ton budget.</p>
        <h2>Ce que le site ne fait pas</h2>
        <p>Les images par seconde affichées sont des <strong>estimations</strong>, pas des mesures. La vue 3D est une représentation à l&apos;échelle, aux formes simplifiées : ce n&apos;est pas une photo des produits. Vérifie toujours la fiche du fabricant avant d&apos;acheter.</p>
      </div>
    </>
  );
}
