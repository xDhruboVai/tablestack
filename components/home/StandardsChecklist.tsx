"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createMotionPath, createTimeline, utils } from "animejs";
import { standards } from "@/content/site";
import { prefersReducedMotion, whenInView } from "@/lib/motion";

/** Time for the car to drive the whole route. */
const DRIVE = 3400;
/** How far the route swings out beside the boxes between stops (px). */
const SWING = 18;

type Pt = { x: number; y: number };

/** A smooth curve through every point (Catmull-Rom converted to cubic Béziers). */
function smooth(pts: Pt[]) {
  const f = (n: number) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(
      p2.y - (p3.y - p1.y) / 6,
    )} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

/**
 * Builds a winding route through the checkboxes, in visiting order, like a track.
 * Between boxes it swings out to the free side (the page margin on the left column, the column
 * gap on the right), and it crosses between columns in a wide swoop under the list, so it never
 * runs over text. Two columns: down the left, swoop across, up the right. One column: down.
 */
function buildRoute(root: HTMLElement) {
  const base = root.getBoundingClientRect();
  const rows = Array.from(root.querySelectorAll<HTMLElement>(".check-row"));
  const boxes = rows.map((row) => {
    const b = row.querySelector(".check-box")!.getBoundingClientRect();
    return { row, x: b.left - base.left + b.width / 2, y: b.top - base.top + b.height / 2 };
  });
  const cols = [...new Set(boxes.map((b) => Math.round(b.x)))].sort((a, b) => a - b);
  const bottom = Math.max(...rows.map((r) => r.getBoundingClientRect().bottom - base.top));

  // Box centres with a swing point between each pair, out to the free side.
  const column = (list: typeof boxes): Pt[] =>
    list.flatMap((b, i) => {
      const next = list[i + 1];
      return next ? [b, { x: b.x - SWING, y: (b.y + next.y) / 2 }] : [b];
    });

  if (cols.length < 2) {
    const order = [...boxes].sort((a, b) => a.y - b.y);
    const first = order[0];
    const last = order[order.length - 1];
    const pts = [{ x: first.x - SWING, y: first.y - 44 }, ...column(order), { x: last.x - SWING, y: last.y + 44 }];
    return { order, d: smooth(pts) };
  }
  const left = boxes.filter((b) => Math.round(b.x) === cols[0]).sort((a, b) => a.y - b.y);
  const right = boxes.filter((b) => Math.round(b.x) !== cols[0]).sort((a, b) => b.y - a.y);
  const lx = left[0].x;
  const rx = right[0].x;
  const span = rx - lx;
  const pts: Pt[] = [
    { x: lx - SWING, y: left[0].y - 44 },
    ...column(left),
    // the swoop under the list
    { x: lx + span * 0.22, y: bottom + 30 },
    { x: lx + span * 0.55, y: bottom + 14 },
    { x: lx + span * 0.85, y: bottom + 34 },
    ...column(right),
    { x: rx - SWING, y: right[right.length - 1].y - 44 },
  ];
  return { order: [...left, ...right], d: smooth(pts) };
}

/**
 * "What you can expect" as a route: a line draws through the six checkboxes while a small car
 * drives along it (anime.js createMotionPath + createDrawable). Each box is ticked as the car
 * reaches it, then an "Agreed" stamp lands.
 */
export default function StandardsChecklist() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<SVGPathElement>(null);
  const car = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const path = track.current;
    const carEl = car.current;
    if (!el || !path || !carEl) return;

    // Keep the route matched to the layout (columns change with screen width).
    let order = buildRoute(el).order;
    const sync = () => {
      const r = buildRoute(el);
      order = r.order;
      path.setAttribute("d", r.d);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);

    if (prefersReducedMotion()) return () => ro.disconnect();

    const ticks = Array.from(el.querySelectorAll<SVGPathElement>(".check-tick"));
    const line = createDrawable(path);
    const stamp = el.querySelector<HTMLElement>(".check-stamp")!;
    utils.set(createDrawable(ticks), { draw: "0 0" });
    utils.set(line, { draw: "0 0" });
    utils.set(stamp, { opacity: 0 });

    let tl: ReturnType<typeof createTimeline> | null = null;
    const stop = whenInView(el, () => {
      // Where along the route each box sits, as a share of the whole drive.
      const total = path.getTotalLength();
      const samples = Array.from({ length: 240 }, (_, i) => {
        const l = (i / 239) * total;
        return { l, p: path.getPointAtLength(l) };
      });
      const reach = (b: { x: number; y: number }) =>
        samples.reduce((best, s) => (Math.hypot(s.p.x - b.x, s.p.y - b.y) < Math.hypot(best.p.x - b.x, best.p.y - b.y) ? s : best)).l / total;

      utils.set(carEl, { opacity: 1 });
      tl = createTimeline()
        .add(carEl, { ...createMotionPath(path), duration: DRIVE, ease: "linear" }, 0)
        .add(line, { draw: ["0 0", "0 1"], duration: DRIVE, ease: "linear" }, 0);
      order.forEach((b) => {
        const tick = b.row.querySelector<SVGPathElement>(".check-tick")!;
        tl!.add(createDrawable(tick), { draw: ["0 0", "0 1"], duration: 380, ease: "out(3)" }, reach(b) * DRIVE);
      });
      tl.add(carEl, { opacity: 0, scale: 0.4, duration: 300, ease: "in(2)" }, DRIVE)
        .add(stamp, { opacity: [0, 1], scale: [2.4, 1], rotate: [-16, -8], duration: 440, ease: "outBack(1.6)" }, DRIVE + 80);
    });

    return () => {
      stop();
      ro.disconnect();
      tl?.revert();
      utils.set(createDrawable(ticks), { draw: "0 1" });
      utils.set(line, { draw: "0 1" });
      utils.set(stamp, { opacity: 1 });
      utils.set(carEl, { opacity: 0 });
    };
  }, []);

  return (
    <div ref={root} className="relative mt-14 md:mt-20">
      <svg className="check-track" aria-hidden="true">
        <path ref={track} />
      </svg>
      <div ref={car} className="check-car" aria-hidden="true" />
      <ul className="relative grid grid-cols-1 gap-x-12 border-t border-rule lg:grid-cols-2">
        {standards.map((s) => (
          <li key={s.k} className="check-row">
            <svg className="check-box" viewBox="0 0 28 28" aria-hidden="true">
              <rect x="1.5" y="1.5" width="25" height="25" rx="4" />
              <path className="check-tick" d="M7.5 14.5l4.5 4.5 8.5-10" />
            </svg>
            <span className="check-key">{s.k}</span>
            <span className="check-val">{s.v}</span>
          </li>
        ))}
      </ul>
      <span className="check-stamp ticket-stamp" aria-hidden="true">
        Agreed
      </span>
    </div>
  );
}
