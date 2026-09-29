import { iso, points, planeMatrix, leftFaceMatrix } from "@/lib/iso";

/**
 * The signature drawing: a restaurant table that is also a stack.
 * Four slabs - front of house on top, back of house at the base - standing on table legs.
 * Pure SVG. The hero animates it: slabs land (intro), then explode apart on scroll.
 */

export const W = 260;
export const D = 180;
export const LEG = 150;

export const LAYERS = [
  { id: "boh", z: 0, t: 18, explode: 0, tag: "04 · BACK OF HOUSE" },
  { id: "res", z: 18, t: 10, explode: -130, tag: "03 · BOOKINGS" },
  { id: "menu", z: 28, t: 10, explode: -260, tag: "02 · MENU" },
  { id: "foh", z: 38, t: 12, explode: -390, tag: "01 · FRONT OF HOUSE" },
] as const;

export const VIEWBOX = { x: -175, y: -470, w: 720, h: 880 };
export const LEADER_END = 262;
export const LABEL_X = 272;

/** Where each layer's label sits once exploded, in viewBox units. */
export function labelY(layerId: string) {
  const l = LAYERS.find((x) => x.id === layerId)!;
  return W * 0.5 - (l.z + l.t) + l.explode;
}

export const toPct = {
  x: (x: number) => ((x - VIEWBOX.x) / VIEWBOX.w) * 100,
  y: (y: number) => ((y - VIEWBOX.y) / VIEWBOX.h) * 100,
};

function Slab({ z, t }: { z: number; t: number }) {
  const zt = z + t;
  return (
    <>
      <polygon className="x-left" points={points([[0, D, zt], [W, D, zt], [W, D, z], [0, D, z]])} />
      <polygon className="x-right" points={points([[W, 0, zt], [W, D, zt], [W, D, z], [W, 0, z]])} />
      <polygon className="x-top" points={points([[0, 0, zt], [W, 0, zt], [W, D, zt], [0, D, zt]])} />
    </>
  );
}

function FohTop() {
  return (
    <g>
      <rect className="x-rule" x="10" y="10" width="240" height="160" rx="3" />
      <rect className="x-ink" x="22" y="20" width="34" height="6" />
      {[170, 194, 218].map((u) => (
        <rect key={u} className="x-muted" x={u} y="21.5" width="18" height="3" />
      ))}
      <rect className="x-ink" x="22" y="40" width="118" height="11" />
      <rect className="x-ink" x="22" y="56" width="90" height="11" />
      <rect className="x-muted" x="22" y="76" width="100" height="3" />
      <rect className="x-muted" x="22" y="83" width="80" height="3" />
      <rect className="x-accent" x="22" y="96" width="46" height="13" rx="6.5" />
      <rect className="x-hatch x-rule" x="150" y="36" width="88" height="80" />
      {/* a plate, of course */}
      <circle className="x-top" cx="194" cy="76" r="27" />
      <circle className="x-rule" cx="194" cy="76" r="18" />
      <circle className="x-accent" cx="190" cy="72" r="7" />
      <circle className="x-ink" cx="200" cy="81" r="3.5" />
      <path className="x-stroke" d="M160 58 V 94 M228 58 V 94" />
      {[22, 94, 166].map((u, i) => (
        <g key={u}>
          <rect className="x-rule" x={u} y="126" width={i === 2 ? 72 : 64} height="32" />
          <rect className="x-muted" x={u + 8} y="134" width="30" height="3" />
          <rect className="x-muted" x={u + 8} y="141" width="20" height="3" />
        </g>
      ))}
    </g>
  );
}

function MenuTop() {
  const widths = [70, 54, 88, 62, 76, 48];
  return (
    <g>
      <rect className="x-ink" x="22" y="16" width="62" height="8" />
      <rect className="x-accent" x="22" y="30" width="22" height="2.5" />
      <path className="x-rule" d="M22 40 H 238" />
      {widths.map((w, i) => {
        const v = 52 + i * 20;
        return (
          <g key={i}>
            <rect className="x-ink" x="22" y={v - 3} width={w} height="5" />
            <path className="x-stroke x-dots" d={`M${22 + w + 6} ${v} H 214`} />
            <rect className={i === 2 ? "x-accent" : "x-ink"} x="222" y={v - 3} width="16" height="5" />
          </g>
        );
      })}
    </g>
  );
}

function ResTop() {
  const cols = [78, 128, 178, 222];
  const rows = [42, 90, 138];
  const booked = new Set(["1-0", "3-1", "0-2", "2-2"]);
  return (
    <g>
      <rect className="x-rule" x="10" y="10" width="240" height="160" rx="2" />
      <rect className="x-hatch x-rule" x="20" y="20" width="18" height="118" />
      <path className="x-stroke" d="M130 170 A 16 16 0 0 1 146 154" />
      {rows.map((v, r) =>
        cols.map((u, c) => {
          const key = `${c}-${r}`;
          return (
            <g key={key}>
              {[
                [0, -16],
                [16, 0],
                [0, 16],
                [-16, 0],
              ].map(([du, dv], k) => (
                <circle key={k} className="x-rule" cx={u + du} cy={v + dv} r="3.2" />
              ))}
              <circle className={booked.has(key) ? "x-accent x-edge" : "x-top"} cx={u} cy={v} r="10.5" />
            </g>
          );
        }),
      )}
    </g>
  );
}

function BohTop() {
  const dots: [number, number][] = [];
  for (let u = 16; u <= 244; u += 12) for (let v = 16; v <= 164; v += 12) dots.push([u, v]);
  return (
    <g>
      {dots.map(([u, v]) => (
        <circle key={`${u}-${v}`} className="x-muted" cx={u} cy={v} r="0.9" />
      ))}
      {[28, 68, 108].map((v, i) => (
        <g key={v}>
          <rect className="x-top" x="26" y={v} width="64" height="28" rx="2" />
          <circle className={i === 0 ? "x-accent" : "x-ink"} cx="36" cy={v + 14} r="2.6" />
          <rect className="x-muted" x="46" y={v + 9} width="34" height="3" />
          <rect className="x-muted" x="46" y={v + 16} width="22" height="3" />
        </g>
      ))}
      <path className="x-stroke" d="M90 42 H 132 V 150 H 232 M90 82 H 132 M90 122 H 132" />
      <rect className="x-top" x="148" y="26" width="86" height="62" rx="2" />
      {[36, 46, 56, 66, 76].map((v, i) => (
        <rect key={v} className={i === 1 ? "x-accent" : "x-ink"} x={158 + (i % 2) * 10} y={v} width={[48, 36, 56, 28, 40][i]} height="3.5" />
      ))}
      <circle className="x-accent" cx="232" cy="150" r="3.5" />
    </g>
  );
}

const TOPS: Record<string, () => React.ReactElement> = {
  foh: FohTop,
  menu: MenuTop,
  res: ResTop,
  boh: BohTop,
};

export default function ExplodedTable({ className = "" }: { className?: string }) {
  const legInset = 14;
  const legs: [number, number][] = [
    [legInset, legInset],
    [W - legInset, legInset],
    [legInset, D - legInset],
    [W - legInset, D - legInset],
  ];

  return (
    <svg
      className={`xtable ${className}`}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      role="img"
      aria-labelledby="xtable-title xtable-desc"
    >
      <title id="xtable-title">Exploded diagram of a restaurant website as a table</title>
      <desc id="xtable-desc">
        A table drawn as four stacked layers: the public website on top, then the menu, then reservations and
        ordering, with hosting and infrastructure at the base, standing on four legs.
      </desc>
      <defs>
        <pattern id="xhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="x-hatch-line" />
        </pattern>
      </defs>

      {/* floor shadow */}
      <g data-shadow>
        <polygon
          className="x-shadow"
          points={points([
            [-8, -8, -LEG],
            [W + 8, -8, -LEG],
            [W + 8, D + 8, -LEG],
            [-8, D + 8, -LEG],
          ])}
        />
      </g>

      {/* legs */}
      <g data-x="legs">
        {legs.map(([x, y], i) => {
          const [x1, y1] = iso(x, y, 0);
          const [, y2] = iso(x, y, -LEG);
          return (
            <line
              key={i}
              data-leg
              className={i === 0 ? "x-leg x-leg-back" : "x-leg"}
              x1={x1}
              y1={y1}
              x2={x1}
              y2={y2}
            />
          );
        })}
      </g>

      {LAYERS.map((l) => {
        const Top = TOPS[l.id];
        const zt = l.z + l.t;
        const [ax, ay] = iso(W, 0, zt);
        return (
          <g key={l.id} data-layer={l.id} data-explode={l.explode}>
            <g data-drop>
              <Slab z={l.z} t={l.t} />
              <g data-detail transform={planeMatrix(zt)}>
                <Top />
              </g>
              <text className="x-tag" transform={leftFaceMatrix(D)} x="10" y={-l.z - l.t / 2 + 2.6}>
                {l.tag}
              </text>
            </g>
            <g data-leader-group>
              <circle className="x-accent" cx={ax} cy={ay} r="3" data-leader-dot />
              <path className="x-leader" d={`M${ax + 6} ${ay} H ${LEADER_END}`} data-leader />
              <path className="x-leader" d={`M${LEADER_END} ${ay - 5} V ${ay + 5}`} data-tick />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
