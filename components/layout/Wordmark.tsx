/** TableStack wordmark: the logo mark beside the name in Schibsted Grotesk ExtraBold. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* At this size the hairline gaps of the artwork would vanish, so they are drawn a little wider. */}
      <Mark className="h-[29px] w-[41px]" gap={26} />
      <span className="font-display text-[20px] font-extrabold leading-none tracking-[-0.045em]">TableStack</span>
    </span>
  );
}

/** One slab of the mark; the three slabs are the same shape, 160 units apart. */
export const MARK_SLAB = (dy: number) =>
  `M50.8 ${130.6 + dy}L404.3 ${24.7 + dy}A194 194 0 0 1 515.7 ${24.7 + dy}L869.2 ${130.6 + dy}A37 37 0 0 1 869.2 ${201.4 + dy}L515.7 ${307.3 + dy}A194 194 0 0 1 404.3 ${307.3 + dy}L50.8 ${201.4 + dy}A37 37 0 0 1 50.8 ${130.6 + dy}Z`;
/** The thin gaps that separate the slabs on the left-hand side. */
export const MARK_GAPS = "M98.2 222.2L450.2 327.6M98.2 382.2L434.2 482.8";
export const MARK_VIEWBOX = "0 0 920 652";

/**
 * The logo mark, traced from the logo artwork: three stacked slabs, the top one in the brand red.
 * The two lower slabs take the text colour, so the mark works on light and dark backgrounds, and the
 * gaps are cut out rather than painted, so whatever is behind the mark shows through them.
 */
export function Mark({ className = "", gap = 12.5 }: { className?: string; gap?: number }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true">
      <mask id="ts-mark-gaps" maskUnits="userSpaceOnUse" x="0" y="0" width="920" height="652">
        <rect width="920" height="652" fill="#fff" />
        <path d={MARK_GAPS} stroke="#000" strokeWidth={gap} />
      </mask>
      <g mask="url(#ts-mark-gaps)" fill="currentColor">
        <path d={MARK_SLAB(320)} />
        <path d={MARK_SLAB(160)} />
      </g>
      <path d={MARK_SLAB(0)} fill="var(--accent)" />
    </svg>
  );
}
