/**
 * TableStacks wordmark in Schibsted Grotesk ExtraBold,
 * with a mark of three stacked isometric slabs. REPLACE when a real logo exists.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark className="h-[22px] w-[22px]" />
      <span className="font-display text-[20px] font-extrabold leading-none tracking-[-0.045em]">TableStacks</span>
    </span>
  );
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3 29 9.5 16 16 3 9.5Z" fill="var(--accent)" />
      <path d="M3 15.5 16 22 29 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M3 21.5 16 28 29 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}
