import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { TransitionProvider } from "@/components/layout/Transition";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";
import RevealRoot from "@/components/motion/RevealRoot";

/* Brand type: Schibsted Grotesk (display + body) and Space Mono (labels, the "back of house" voice). */
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-schibsted",
  display: "swap",
});
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });
/* Only used inside the placeholder client artwork (Brasa, Sumi), not part of the TableStacks brand. */
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
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
  width: "device-width",
  initialScale: 1,
};

/* Runs before paint: restores BOH mode, enables motion styles, flags a first visit for the loader. */
const bootScript = `(function(){try{var d=document.documentElement;
if(localStorage.getItem('ts-mode')==='boh')d.dataset.mode='boh';
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');
if(!sessionStorage.getItem('ts-visited')){d.classList.add('first-visit');sessionStorage.setItem('ts-visited','1');}}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <Nav />
          <main id="main" tabIndex={-1} className="relative z-[2] outline-none">
            {children}
          </main>
          <Footer />
        </TransitionProvider>
        <Loader />
        <RevealRoot />
      </body>
    </html>
  );
}
