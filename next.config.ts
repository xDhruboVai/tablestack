import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Basic browser protections on every response: no type guessing, no framing by other sites, less referrer detail.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
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
