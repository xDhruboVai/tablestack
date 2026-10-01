import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
      { source: "/why-choose-tablestack", destination: "/why-tablestack", permanent: true },
    ];
  },
};

export default nextConfig;
