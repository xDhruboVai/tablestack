import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Vercel preview deployments load Vercel's own feedback toolbar; the live site does not.
const isPreview = process.env.VERCEL_ENV === "preview";

/**
 * Content Security Policy: the list of places the browser may load things from. Anything not listed is
 * refused, so a script or frame slipped into a page from another site will not run.
 * The site's own inline scripts and styles are allowed ('unsafe-inline'), because Next.js and the theme
 * switch rely on them and pages stay fast, static files this way.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${isPreview ? " https://vercel.live" : ""}`,
  `style-src 'self' 'unsafe-inline'${isPreview ? " https://vercel.live" : ""}`,
  `img-src 'self' data: blob:${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self' data:${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  // The team cards read public GitHub activity from this one service.
  `connect-src 'self' https://github-contributions-api.jogruber.de${isDev ? " ws: wss:" : ""}${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Browser protections on every response.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Always use HTTPS for this site for the next two years.
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
        ],
      },
      {
        // The admin page and the form endpoints are never cached or listed by search engines.
        source: "/(admin|api)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  // Common addresses people guess or link to: send them to the page that covers it.
  async redirects() {
    return [
      // One canonical host: www forwards to the bare domain, keeping the path and query string.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tablestackbd.com" }],
        destination: "https://tablestackbd.com/:path*",
        permanent: true,
      },
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/why-choose-tablestack", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
