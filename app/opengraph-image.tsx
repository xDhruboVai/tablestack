import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/** Default social card, generated at build time. Replace with a designed image later if you like. */
export const alt = `${site.name} | ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F2EEE6",
          color: "#15130F",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <path d="M16 3 29 9.5 16 16 3 9.5Z" fill="#E0432A" />
            <path d="M3 15.5 16 22 29 15.5" fill="none" stroke="#15130F" strokeWidth="2.2" />
            <path d="M3 21.5 16 28 29 21.5" fill="none" stroke="#15130F" strokeWidth="2.2" />
          </svg>
          <span style={{ display: "flex" }}>
            <span style={{ fontStyle: "italic" }}>Table</span>
            <span style={{ fontWeight: 700 }}>Stacks</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>Websites for restaurants.</span>
          <span style={{ color: "#E0432A", fontStyle: "italic" }}>Front of house to back.</span>
        </div>
      </div>
    ),
    size,
  );
}
