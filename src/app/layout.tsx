import type { Metadata } from "next";
import "./globals.css";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#main" className="skip">Aller au contenu</a>
        <header className="topbar">
          <nav className="wrap nav" aria-label="Navigation principale">
            <a href="/" className="brand" aria-label="AI PC Builder — accueil">
              <span className="brand-mark" aria-hidden="true">◆</span> AI PC Builder
              <span className="badge-demo" title="Version de démonstration : données non contractuelles">DÉMO</span>
            </a>
            <div className="links">
              <a href="/builder">Configurateur</a>
              <a href="/compare">Comparer</a>
              <a href="/community">Communauté</a>
              <a href="/pc">Guides PC</a>
              <a href="/price-alerts">Alertes prix</a>
              <a href="/admin">Admin</a>
            </div>
          </nav>
        </header>
        <div className="demo-banner" role="note">
          Données de démonstration — prix, stocks et FPS estimés non contractuels. Compatibilité vérifiée par moteur déterministe.
          <a href="/affiliate-disclosure"> Transparence affiliation</a>
        </div>
        <main id="main" className="wrap">{children}</main>
        <footer className="footer">
          <div className="wrap foot-grid">
            <div><strong>AI PC Builder</strong><p>Décris ton PC. L&apos;IA le construit, le vérifie, l&apos;optimise.</p></div>
            <nav aria-label="Légal"><a href="/legal">Mentions</a><a href="/legal">Confidentialité</a><a href="/legal">CGU</a><a href="/legal">Cookies</a><a href="/affiliate-disclosure">Affiliation</a></nav>
            <nav aria-label="Produit"><a href="/about">À propos</a><a href="/contact">Contact</a><a href="/community">Communauté</a><a href="/admin">Admin</a></nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
