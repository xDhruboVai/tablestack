import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/content/site";
import { TransitionProvider } from "@/components/layout/Transition";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";
import RevealRoot from "@/components/motion/RevealRoot";
import { getVisibleProjects } from "@/lib/visibility";

/* Brand type: Schibsted Grotesk (display + body) and Space Mono (labels, the "back of house" voice). */
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-schibsted",
  display: "swap",
});
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });
/* Only used inside the placeholder client artwork (Brasa, Sumi), not part of the TableStack brand. */
const artSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-art-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s | ${site.name}`,
  },
  description: site.seoDescription,
  applicationName: site.name,
  // Keep Vercel preview and development deployments out of search results; only production is indexable.
  robots: process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production" ? { index: false, follow: false } : undefined,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.seoTitle,
    description: site.seoDescription,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.seoDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#eee8e3",
  width: "device-width",
  initialScale: 1,
};

/* Runs before paint: starts in light mode unless the visitor chose dark before, enables motion styles, flags a first visit for the loader. */
const bootScript = `(function(){try{var d=document.documentElement;
if(localStorage.getItem('ts-mode')==='boh')d.dataset.mode='boh';else delete d.dataset.mode;
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');
if(!sessionStorage.getItem('ts-visited')){d.classList.add('first-visit');sessionStorage.setItem('ts-visited','1');}}
}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // With every project switched off, the Work link is left out of the navigation.
  const showWork = (await getVisibleProjects()).length > 0;
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${artSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TransitionProvider>
          <Nav showWork={showWork} />
          <main id="main" tabIndex={-1} className="relative z-[2] outline-none">
            {children}
          </main>
          <Footer showWork={showWork} />
        </TransitionProvider>
        <Loader />
        <RevealRoot />
        <Analytics />
      </body>
    </html>
  );
}
