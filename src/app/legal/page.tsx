export const metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <>
      <div className="page-head"><span className="label"><b>Informations légales</b></span><h2>Mentions légales</h2></div>
      <div className="prose">
        <p><strong>À compléter avant la mise en ligne</strong> : nom et adresse de l&apos;éditeur, numéro SIRET, directeur de la publication, hébergeur.</p>
        <h2>Données personnelles</h2>
        <p>Le site ne crée pas de compte et ne dépose aucun cookie publicitaire. Les demandes saisies sur la page d&apos;accueil sont traitées par le serveur pour calculer une configuration et ne sont pas conservées.</p>
        <h2>Prix et estimations</h2>
        <p>Les prix sont indicatifs et datés. Les estimations de performance ne sont pas des mesures. Rien de ce qui est affiché n&apos;a de valeur contractuelle.</p>
      </div>
    </>
  );
}
