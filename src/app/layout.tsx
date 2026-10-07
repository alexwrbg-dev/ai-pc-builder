import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { AMAZON_DISCLOSURE, AMAZON_TAG } from "@/lib/affiliate";
import { CATALOG, PRICE_DATE } from "@/lib/catalog";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="5" y="2.5" width="16" height="21" />
      <circle cx="13" cy="9" r="3.4" />
      <path d="M8 16h10M8 19.5h6M1 6h4M1 20h4M21 6h4M21 20h4" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const priceDate = new Date(PRICE_DATE).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <html lang="fr">
      <body>
        {/* Sans JavaScript, les blocs animés au défilement restent visibles. */}
        <noscript><style>{".reveal{opacity:1;transform:none}"}</style></noscript>
        <a href="#main" className="skip">Aller au contenu</a>
        <header className="topbar">
          <nav className="wrap nav" aria-label="Navigation principale">
            <a href="/" className="brand" aria-label="AI PC Builder, accueil"><Mark /> <span className="brand-name">AI PC Builder</span></a>
            <span className="label nav-meta">Éch. 1:10 · {CATALOG.length} pièces</span>
            <div className="links">
              <a href="/builder">Configurateur</a>
              <a href="/composants">Composants</a>
              <a href="/pc">Guides</a>
            </div>
          </nav>
        </header>
        <main id="main" className="wrap">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <div className="cartouche">
              <div>
                <span className="label">Projet</span>
                <span className="big">AI PC Builder</span>
                <span className="muted">Décris ton PC. On en tire les plans, on vérifie que tout s&apos;assemble, et on chiffre.</span>
              </div>
              <div>
                <span className="label">Outils</span>
                <a href="/builder">Configurateur 3D</a>
                <a href="/composants">Catalogue</a>
                <a href="/pc">Guides par budget</a>
              </div>
              <div>
                <span className="label">Relevé des prix</span>
                <span>{priceDate}</span>
                <span className="muted small">Prix indicatifs. Celui du marchand fait foi.</span>
              </div>
              <div>
                <span className="label">Informations</span>
                <a href="/about">À propos</a>
                <a href="/affiliate-disclosure">Affiliation</a>
                <a href="/legal">Mentions légales</a>
                <a href="/contact">Contact</a>
              </div>
            </div>
            <p className="legal-line">
              {AMAZON_TAG ? `${AMAZON_DISCLOSURE} ` : ""}
              Les estimations de performance ne sont pas des mesures. Les marques citées appartiennent à leurs propriétaires.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
