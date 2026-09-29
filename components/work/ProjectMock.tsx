import type { Motif as MotifName, Project } from "@/content/projects";

/**
 * Code-drawn placeholder art for a project - a mini website in the (fictional) client's brand.
 * Swap for real screenshots by filling `media` / `gallery[].src` in content/projects.ts.
 *
 * frame="desktop"  1200×750  browser view (also used as the cover)
 * frame="mobile" | "menu" | "detail" | "boh"   1000×1000
 * layer="boh"      the same desktop view as a blueprint (used by the lens + BOH mode)
 */

type Frame = "desktop" | "mobile" | "menu" | "detail" | "boh";

const FONTS = {
  serif: { fontFamily: "var(--font-art-serif), serif", fontWeight: 400, letterSpacing: "-0.02em" },
  condensed: { fontFamily: "var(--font-schibsted), sans-serif", fontWeight: 900, letterSpacing: "-0.055em" },
  sans: { fontFamily: "var(--font-schibsted), sans-serif", fontWeight: 700, letterSpacing: "-0.04em" },
  mono: { fontFamily: "var(--font-space-mono), monospace", fontWeight: 700, letterSpacing: "-0.04em" },
} as const;
const MONO = { fontFamily: "var(--font-space-mono), monospace" };
const SANS = { fontFamily: "var(--font-schibsted), sans-serif" };

const BP = { bg: "#15130F", line: "rgba(242,238,230,0.16)", text: "#F2EEE6", dim: "rgba(242,238,230,0.55)", accent: "#E0432A" };

export function Motif({
  name,
  x,
  y,
  size,
  fill,
  detail,
}: {
  name: MotifName;
  x: number;
  y: number;
  size: number;
  fill: string;
  detail: string;
}) {
  const s = size / 200;
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (name) {
    case "flame":
      return (
        <g transform={t}>
          <path
            d="M100 196C46 188 22 146 34 104c8-28 30-44 36-74 14 22 16 40 12 58 16-12 22-36 18-68 40 26 72 70 70 118-2 36-28 58-70 58Z"
            fill={fill}
          />
          <path d="M100 190c-22-2-36-18-34-38 2-18 16-28 20-44 10 14 12 26 10 36 10-4 16-16 16-30 20 18 28 36 24 52-4 16-18 24-36 24Z" fill={detail} />
        </g>
      );
    case "loaf":
      return (
        <g transform={t}>
          <path d="M14 132C14 76 58 50 100 50s86 26 86 82c0 18-12 24-86 24S14 150 14 132Z" fill={fill} />
          {[58, 92, 126].map((cx) => (
            <path key={cx} d={`M${cx - 10} 118 Q ${cx} 84 ${cx + 18} 74`} stroke={detail} strokeWidth="7" fill="none" strokeLinecap="round" />
          ))}
        </g>
      );
    case "enso":
      return (
        <g transform={t}>
          <path d="M150 42A78 78 0 1 0 176 104" fill="none" stroke={fill} strokeWidth="20" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill={detail} />
        </g>
      );
    case "leaf":
      return (
        <g transform={t}>
          <path d="M100 12c62 34 76 118 0 176C24 130 38 46 100 12Z" fill={fill} />
          <path d="M100 30v150M100 80l-26-18M100 110l30-22M100 140l-28-18" stroke={detail} strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "book":
      return (
        <g transform={t}>
          <path d="M100 52C78 38 44 36 14 44v112c30-8 64-6 86 8Z" fill={fill} />
          <path d="M100 52c22-14 56-16 86-8v112c-30-8-64-6-86 8Z" fill={fill} opacity="0.75" />
          <path d="M34 74h44M34 92h40M34 110h44M122 74h44M126 92h40M122 110h44" stroke={detail} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
  }
}

function Leader({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  return <path d={`M${x1} ${y}H${x2}`} stroke={color} strokeWidth="2" strokeDasharray="0.1 7" strokeLinecap="round" opacity="0.55" />;
}

function Chrome({ p, w }: { p: Project["art"]["palette"]; w: number }) {
  return (
    <g>
      <rect width={w} height="44" fill={p.soft} />
      {[24, 44, 64].map((cx) => (
        <circle key={cx} cx={cx} cy="22" r="6" fill={p.fg} opacity="0.25" />
      ))}
      <rect x={w / 2 - 170} y="11" width="340" height="22" rx="11" fill={p.bg} opacity="0.6" />
    </g>
  );
}

function SiteNav({ project }: { project: Project }) {
  const { palette: p, type } = project.art;
  return (
    <g>
      <text x="60" y="104" fontSize="30" fill={p.fg} style={FONTS[type]}>
        {project.title}
      </text>
      {["Menu", "Visit", "About"].map((l, i) => (
        <text key={l} x={720 + i * 92} y="101" fontSize="16" fill={p.fg} opacity="0.75" style={SANS}>
          {l}
        </text>
      ))}
      <rect x="1000" y="76" width="140" height="40" rx="20" fill={p.accent} />
      <text x="1070" y="101" fontSize="15" textAnchor="middle" fill={p.bg} style={{ ...SANS, fontWeight: 600 }}>
        Book a table
      </text>
    </g>
  );
}

function Dishes({ project, x, y, w, size = 17 }: { project: Project; x: number; y: number; w: number; size?: number }) {
  const { palette: p } = project.art;
  return (
    <g>
      {project.art.dishes.map(([name, price], i) => {
        const yy = y + i * (size * 2.1);
        const nameW = name.length * size * 0.52;
        return (
          <g key={name}>
            <text x={x} y={yy} fontSize={size} fill={p.fg} style={SANS}>
              {name}
            </text>
            <Leader x1={x + nameW + 10} x2={x + w - 46} y={yy - size * 0.3} color={p.fg} />
            <text x={x + w} y={yy} fontSize={size} fill={p.fg} textAnchor="end" style={MONO}>
              {price}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ── Desktop, front of house ───────────────────────────────── */
function DesktopFoh({ project }: { project: Project }) {
  const { palette: p, type, motif, layout, tagline } = project.art;
  // Fit the wordmark to the space it has (approximate glyph widths per type style)
  const EM = { serif: 0.46, condensed: 0.7, sans: 0.62, mono: 0.62 }[type];
  const fit = (base: number, maxWidth: number) => Math.min(base, maxWidth / (project.title.length * EM));

  return (
    <g>
      <rect width="1200" height="750" fill={p.bg} />
      {layout === "split" && <rect x="0" y="44" width="540" height="706" fill={p.soft} />}
      <Chrome p={p} w={1200} />
      <SiteNav project={project} />

      {layout === "poster" && (
        <g>
          <Motif name={motif} x={690} y={150} size={440} fill={p.accent} detail={p.soft} />
          <text x="64" y="186" fontSize="15" fill={p.accent} style={MONO}>
            ● OPEN TONIGHT · 17:00 TO 23:00
          </text>
          <text x="48" y="600" fontSize={fit(270, 620)} fill={p.fg} style={FONTS[type]}>
            {project.title}
          </text>
          <text x="62" y="660" fontSize="24" fill={p.fg} opacity="0.75" style={SANS}>
            {tagline}
          </text>
          <g transform="translate(790 600)">
            <rect x="-24" y="-40" width="370" height="150" fill={p.bg} opacity="0.85" />
            <Dishes project={project} x={0} y={0} w={330} size={17} />
          </g>
        </g>
      )}

      {layout === "split" && (
        <g>
          <Motif name={motif} x={70} y={190} size={400} fill={p.accent} detail={p.soft} />
          <text x="600" y="330" fontSize={fit(200, 540)} fill={p.fg} style={{ ...FONTS[type], textTransform: "uppercase" }}>
            {project.title.toUpperCase()}
          </text>
          <text x="604" y="384" fontSize="26" fill={p.fg} style={SANS}>
            {tagline}
          </text>
          <Dishes project={project} x={604} y={470} w={520} size={19} />
          <rect x="604" y="620" width="260" height="52" rx="26" fill={p.fg} />
          <text x="734" y="652" fontSize="16" textAnchor="middle" fill={p.bg} style={{ ...SANS, fontWeight: 600 }}>
            Pre-order for tomorrow
          </text>
        </g>
      )}

      {layout === "center" && (
        <g>
          <Motif name={motif} x={380} y={170} size={440} fill={p.accent} detail={p.fg} />
          <text x="600" y="420" fontSize="112" textAnchor="middle" fill={p.fg} style={FONTS[type]}>
            {project.title}
          </text>
          <text x="600" y="672" fontSize="20" textAnchor="middle" fill={p.fg} opacity="0.7" style={SANS}>
            {tagline}
          </text>
          <text x="600" y="712" fontSize="14" textAnchor="middle" fill={p.accent} letterSpacing="3" style={MONO}>
            NEXT RELEASE · {project.art.dishes[2]?.[1]}
          </text>
        </g>
      )}

      {layout === "grid" && (
        <g>
          <text x="54" y="290" fontSize={fit(160, 860)} fill={p.fg} style={FONTS[type]}>
            {project.title}
          </text>
          <text x="60" y="340" fontSize="22" fill={p.fg} opacity="0.75" style={SANS}>
            {tagline}
          </text>
          <Motif name={motif} x={980} y={150} size={170} fill={p.accent} detail={p.bg} />
          {project.art.dishes.map(([name, sub], i) => (
            <g key={name} transform={`translate(${60 + i * 364} 400)`}>
              <rect width="336" height="300" fill={p.soft} />
              <Motif name={motif} x={112} y={40} size={112} fill={i === 1 ? p.accent : p.fg} detail={p.soft} />
              <text x="24" y="228" fontSize="22" fill={p.fg} style={{ ...SANS, fontWeight: 600 }}>
                {name}
              </text>
              <text x="24" y="262" fontSize="15" fill={p.fg} opacity="0.7" style={MONO}>
                {sub}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

/* ── Desktop, back of house (blueprint) ─────────────────────── */
type Box = [number, number, number, number, string];

const REGIONS: Record<Project["art"]["layout"], Box[]> = {
  poster: [
    [680, 140, 470, 470, "<Hero.Image priority sizes='50vw' />"],
    [60, 162, 360, 36, "<OpenNow source={hours} />"],
    [44, 400, 660, 230, "<h1> display · clamp(6rem, 18vw)"],
    [770, 560, 390, 160, "<Menu source='cms' limit={3} />"],
  ],
  split: [
    [0, 120, 540, 630, "<Hero.Image art='loaf' />"],
    [596, 180, 560, 220, "<h1> condensed · 800"],
    [596, 440, 540, 140, "<TodaysBake source='cms' />"],
    [596, 610, 280, 72, "<PreOrder provider='square' />"],
  ],
  center: [
    [360, 150, 480, 480, "<Hero.Mark />"],
    [420, 340, 360, 110, "<h1> serif"],
    [380, 640, 440, 90, "<Release date={next} />"],
  ],
  grid: [
    [44, 150, 700, 210, "<h1> + <Lede />"],
    [960, 140, 210, 210, "<Mark />"],
    [50, 390, 1100, 320, "<LocationGrid source='cms' />"],
  ],
};

function DesktopBoh({ project }: { project: Project }) {
  const regions = REGIONS[project.art.layout];
  const provider =
    project.stack.find((s) => ["Resy", "Tock", "Toast", "Square", "Shopify", "OpenTable"].includes(s)) ?? "Resy";
  const cols = Array.from({ length: 13 }, (_, i) => 60 + i * (1080 / 12));
  return (
    <g>
      <rect width="1200" height="750" fill={BP.bg} />
      {cols.map((x) => (
        <path key={x} d={`M${x} 44V750`} stroke={BP.accent} strokeOpacity="0.16" />
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M0 ${44 + i * 40}H1200`} stroke={BP.line} strokeOpacity="0.4" />
      ))}
      <rect width="1200" height="44" fill="#1E1B17" />
      <text x="24" y="28" fontSize="13" fill={BP.dim} style={MONO}>
        {project.slug}.com / app/page.tsx
      </text>
      <rect x="40" y="64" width="1120" height="64" fill="none" stroke={BP.text} strokeOpacity="0.5" strokeDasharray="6 5" />
      <text x="52" y="84" fontSize="12" fill={BP.dim} style={MONO}>
        {"<Nav sticky />"}
      </text>
      <rect x="1000" y="76" width="140" height="40" rx="20" fill="none" stroke={BP.accent} />
      <text x="1070" y="101" fontSize="12" textAnchor="middle" fill={BP.accent} style={MONO}>
        {`<Book via='${provider.toLowerCase()}' />`}
      </text>
      {regions.map(([x, y, w, h, label], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="rgba(224,67,42,0.06)" stroke={BP.accent} strokeDasharray="6 5" />
          <rect x={x} y={y} width={Math.min(w, label.length * 8.2 + 16)} height="22" fill={BP.accent} />
          <text x={x + 8} y={y + 15} fontSize="12" fill={BP.bg} style={MONO}>
            {label}
          </text>
          <text x={x + w - 8} y={y + h - 10} fontSize="11" textAnchor="end" fill={BP.dim} style={MONO}>
            {w}×{h}
          </text>
        </g>
      ))}
      <g transform="translate(64 690)">
        <text fontSize="12" fill={BP.dim} style={MONO}>
          {`stack: ${project.stack.join(" · ")}`}
        </text>
      </g>
    </g>
  );
}

/* ── Square frames (gallery) ───────────────────────────────── */
function MobileFrame({ project }: { project: Project }) {
  const { palette: p, type } = project.art;
  const Phone = ({ x, children }: { x: number; children: React.ReactNode }) => (
    <g transform={`translate(${x} 110)`}>
      <rect width="330" height="700" rx="46" fill={p.fg} />
      <rect x="10" y="10" width="310" height="680" rx="38" fill={p.bg} />
      <rect x="125" y="22" width="80" height="22" rx="11" fill={p.fg} />
      {children}
    </g>
  );
  return (
    <g>
      <rect width="1000" height="1000" fill={p.soft} />
      <Phone x={140}>
        <text x="32" y="108" fontSize="32" fill={p.fg} style={FONTS[type]}>
          {project.title}
        </text>
        <text x="32" y="160" fontSize="13" fill={p.accent} letterSpacing="2" style={MONO}>
          TONIGHT&apos;S MENU
        </text>
        <g transform="translate(-28 0)">
          <Dishes project={project} x={60} y={210} w={266} size={14} />
        </g>
        {[330, 372, 414, 456].map((y, i) => (
          <g key={y}>
            <rect x="32" y={y} width={[150, 120, 170, 100][i]} height="9" rx="4.5" fill={p.fg} opacity="0.2" />
            <rect x="262" y={y} width="30" height="9" rx="4.5" fill={p.fg} opacity="0.2" />
          </g>
        ))}
        <rect x="32" y="600" width="266" height="52" rx="26" fill={p.accent} />
        <text x="165" y="632" fontSize="15" textAnchor="middle" fill={p.bg} style={{ ...SANS, fontWeight: 600 }}>
          Book a table
        </text>
      </Phone>
      <Phone x={530}>
        <text x="32" y="108" fontSize="26" fill={p.fg} style={{ ...SANS, fontWeight: 600 }}>
          Book a table
        </text>
        <text x="32" y="150" fontSize="12" fill={p.fg} opacity="0.6" letterSpacing="1.5" style={MONO}>
          PARTY OF 2 · FRIDAY
        </text>
        {["Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <g key={d} transform={`translate(${32 + i * 68} 180)`}>
            <rect width="58" height="70" rx="12" fill={i === 1 ? p.fg : "none"} stroke={p.fg} strokeOpacity="0.3" />
            <text x="29" y="42" fontSize="14" textAnchor="middle" fill={i === 1 ? p.bg : p.fg} style={SANS}>
              {d}
            </text>
          </g>
        ))}
        {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((t, i) => {
          const taken = [1, 4, 5].includes(i);
          return (
            <g key={t} transform={`translate(${32 + (i % 2) * 138} ${290 + Math.floor(i / 2) * 64})`}>
              <rect width="128" height="50" rx="25" fill={i === 2 ? p.accent : "none"} stroke={p.fg} strokeOpacity={taken ? 0.12 : 0.35} />
              <text x="64" y="31" fontSize="15" textAnchor="middle" fill={i === 2 ? p.bg : p.fg} opacity={taken ? 0.3 : 1} style={MONO}>
                {t}
              </text>
            </g>
          );
        })}
        <rect x="32" y="600" width="266" height="52" rx="26" fill={p.fg} />
        <text x="165" y="632" fontSize="15" textAnchor="middle" fill={p.bg} style={{ ...SANS, fontWeight: 600 }}>
          Confirm 19:00
        </text>
      </Phone>
    </g>
  );
}

function MenuFrame({ project }: { project: Project }) {
  const { palette: p, type, motif } = project.art;
  return (
    <g>
      <rect width="1000" height="1000" fill={p.bg} />
      <rect x="120" y="80" width="760" height="840" fill="none" stroke={p.fg} strokeOpacity="0.25" />
      <Motif name={motif} x={460} y={120} size={80} fill={p.accent} detail={p.bg} />
      <text x="500" y="280" fontSize="64" textAnchor="middle" fill={p.fg} style={FONTS[type]}>
        {project.title}
      </text>
      <text x="500" y="330" fontSize="14" textAnchor="middle" fill={p.accent} letterSpacing="4" style={MONO}>
        TONIGHT
      </text>
      <Dishes project={project} x={200} y={420} w={600} size={22} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="200" y={600 + i * 56} width={[220, 180, 250, 160][i]} height="12" rx="6" fill={p.fg} opacity="0.18" />
          <rect x="740" y={600 + i * 56} width="60" height="12" rx="6" fill={p.fg} opacity="0.18" />
        </g>
      ))}
      <text x="500" y="870" fontSize="13" textAnchor="middle" fill={p.fg} opacity="0.5" style={MONO}>
        Edited by staff · updates instantly
      </text>
    </g>
  );
}

function DetailFrame({ project }: { project: Project }) {
  const { palette: p, type, motif } = project.art;
  const swatches: [string, string][] = [
    [p.bg, "Ground"],
    [p.fg, "Ink"],
    [p.accent, "Accent"],
    [p.soft, "Soft"],
  ];
  return (
    <g>
      <rect width="1000" height="1000" fill={p.bg} />
      <text x="70" y="470" fontSize="420" fill={p.fg} style={FONTS[type]}>
        Aa
      </text>
      <Motif name={motif} x={640} y={110} size={280} fill={p.accent} detail={p.bg} />
      <text x="76" y="560" fontSize="14" fill={p.fg} opacity="0.6" letterSpacing="2" style={MONO}>
        DISPLAY · {type.toUpperCase()}
      </text>
      <path d="M76 600H924" stroke={p.fg} strokeOpacity="0.2" />
      {swatches.map(([c, n], i) => (
        <g key={n} transform={`translate(${76 + i * 216} 660)`}>
          <rect width="190" height="190" fill={c} stroke={p.fg} strokeOpacity="0.2" />
          <text y="230" fontSize="15" fill={p.fg} style={{ ...SANS, fontWeight: 600 }}>
            {n}
          </text>
          <text y="256" fontSize="13" fill={p.fg} opacity="0.6" style={MONO}>
            {c.toUpperCase()}
          </text>
        </g>
      ))}
    </g>
  );
}

function BohFrame({ project }: { project: Project }) {
  const provider =
    project.stack.find((s) => ["Resy", "Tock", "Toast", "Square", "Shopify", "OpenTable"].includes(s)) ?? "Booking";
  const cms = project.stack.includes("Sanity") ? "Sanity CMS" : "Content editor";
  const nodes: [number, number, string, string][] = [
    [80, 180, "Guests", "phone · laptop"],
    [80, 620, "Your staff", "edit from a phone"],
    [390, 400, `${project.title}.com`, "Next.js"],
    [700, 180, provider, "bookings / orders"],
    [700, 400, cms, "menus · hours"],
    [700, 620, "Vercel", "hosting · edge"],
  ];
  const edges: [number, number][] = [
    [0, 2],
    [1, 4],
    [4, 2],
    [2, 3],
    [2, 5],
  ];
  const c = (i: number) => [nodes[i][0] + 110, nodes[i][1] + 50] as const;
  return (
    <g>
      <rect width="1000" height="1000" fill={BP.bg} />
      {Array.from({ length: 25 }, (_, i) => (
        <path key={i} d={`M${i * 40} 0V1000M0 ${i * 40}H1000`} stroke={BP.line} strokeOpacity="0.35" />
      ))}
      <text x="80" y="110" fontSize="15" fill={BP.accent} letterSpacing="2" style={MONO}>
        BACK OF HOUSE · HOW IT&apos;S WIRED
      </text>
      {edges.map(([a, b], i) => {
        const [x1, y1] = c(a);
        const [x2, y2] = c(b);
        const mx = (x1 + x2) / 2;
        return <path key={i} d={`M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`} fill="none" stroke={BP.accent} strokeWidth="2" strokeDasharray="7 6" />;
      })}
      {nodes.map(([x, y, t, s], i) => (
        <g key={t} transform={`translate(${x} ${y})`}>
          <rect width="220" height="100" fill={i === 2 ? BP.accent : "#1F1C18"} stroke={i === 2 ? BP.accent : BP.text} strokeOpacity="0.5" />
          <text x="18" y="44" fontSize="20" fill={i === 2 ? BP.bg : BP.text} style={{ ...SANS, fontWeight: 600 }}>
            {t}
          </text>
          <text x="18" y="74" fontSize="13" fill={i === 2 ? BP.bg : BP.dim} style={MONO}>
            {s}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function ProjectMock({
  project,
  frame = "desktop",
  layer = "foh",
  slice = false,
  className = "",
  title,
}: {
  project: Project;
  frame?: Frame;
  layer?: "foh" | "boh";
  /** Crop to fill the container instead of letterboxing. */
  slice?: boolean;
  className?: string;
  /** Accessible label; omit for decorative duplicates. */
  title?: string;
}) {
  const desktop = frame === "desktop";
  const vb = desktop ? "0 0 1200 750" : "0 0 1000 1000";
  // When cropped into a tall container, keep the wordmark side of each layout in frame.
  const anchor = desktop
    ? { poster: "xMinYMid", split: "xMaxYMid", center: "xMidYMid", grid: "xMinYMid" }[project.art.layout]
    : "xMidYMid";
  return (
    <svg
      viewBox={vb}
      preserveAspectRatio={slice ? `${anchor} slice` : "xMidYMid meet"}
      className={`h-full w-full ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {desktop && layer === "foh" && <DesktopFoh project={project} />}
      {desktop && layer === "boh" && <DesktopBoh project={project} />}
      {frame === "mobile" && <MobileFrame project={project} />}
      {frame === "menu" && <MenuFrame project={project} />}
      {frame === "detail" && <DetailFrame project={project} />}
      {frame === "boh" && <BohFrame project={project} />}
    </svg>
  );
}
