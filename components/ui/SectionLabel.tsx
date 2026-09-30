/** "Selected work" label used to open every section. `index` is kept for reference, not shown. */
export default function SectionLabel({ label, className = "" }: { index?: string; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="eyebrow" data-reveal="scramble">
        {label}
      </span>
    </div>
  );
}
