import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MARK_GAPS, MARK_SLAB, MARK_VIEWBOX } from "@/components/layout/Wordmark";
import { site } from "@/content/site";

export const alt = `${site.name}: Websites built around your business`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#0A0A0A";
const paper = "#F2EFEA";
const red = "#E44935";
const displayFont = await readFile(join(process.cwd(), "assets/fonts/SchibstedGrotesk-ExtraBold.ttf"));

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: ink,
          color: paper,
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ width: 14, height: "100%", background: red }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "51px 0 56px 64px",
            width: 735,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 17, fontSize: 36, fontWeight: 800, letterSpacing: -1.5 }}>
            {/* The logo mark. The gaps are painted in the background colour, which this image always has. */}
            <svg width="62" height="44" viewBox={MARK_VIEWBOX}>
              <path d={MARK_SLAB(320)} fill={paper} />
              <path d={MARK_SLAB(160)} fill={paper} />
              <path d={MARK_GAPS} stroke={ink} strokeWidth="12.5" />
              <path d={MARK_SLAB(0)} fill={red} />
            </svg>
            <span>{site.name}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 0.99, letterSpacing: -4, fontWeight: 800 }}>
            <span>Websites built</span>
            <span>around your</span>
            <span style={{ color: red }}>business.</span>
          </div>

          <div style={{ display: "flex", width: 110, height: 7, background: red }} />
        </div>

        <svg width="500" height="500" viewBox="0 0 500 500" style={{ position: "absolute", right: 0, top: 67 }}>
          <path d="M52 321 248 236 446 321 250 406Z" fill="#171717" stroke={paper} strokeWidth="4" />
          <path d="M52 321v23l198 85v-23M250 406v23l196-85v-23" fill="none" stroke={paper} strokeWidth="4" />
          <path d="M52 220 248 135 446 220 250 305Z" fill="#171717" stroke={paper} strokeWidth="4" />
          <path d="M52 220v23l198 85v-23M250 305v23l196-85v-23" fill="none" stroke={paper} strokeWidth="4" />
          <path d="M52 119 248 34 446 119 250 204Z" fill={paper} stroke={paper} strokeWidth="4" />
          <path d="M52 119v23l198 85v-23M250 204v23l196-85v-23" fill={red} stroke={paper} strokeWidth="4" />
          <path d="m105 121 82-36 47 20-82 36Z" fill={red} />
          <path d="m255 78 89 38M239 101l120 51M224 125l88 37" fill="none" stroke={ink} strokeWidth="11" strokeLinecap="round" />
          <path d="m115 226 123 53m18-59 68 29m-200 74 65 28m75-70 106 46" fill="none" stroke={red} strokeWidth="9" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Schibsted Grotesk", data: displayFont, weight: 800, style: "normal" }],
    },
  );
}
