import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import '@/styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * `metadataBase` sert de racine aux URLs relatives (Open Graph, canoniques).
 * Sans lui, Next avertit au build et les aperçus de partage sont cassés.
 */
export const metadata: Metadata = {
  metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  ),
  title: {
    default: 'Kasa — Location de logements entre particuliers',
    template: '%s | Kasa',
  },
  description:
      'Location d’appartements et de maisons entre particuliers en Île-de-France.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Kasa',
  },
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="fr" className={inter.variable}>
        <body>
          <FavoritesProvider>
            <a href="#contenu" className="skipLink">
              Aller au contenu
            </a>

            <Header />

            <main id="contenu" className="page">
              {children}
            </main>

            <Footer />
          </FavoritesProvider>
        </body>
      </html>
  );
}