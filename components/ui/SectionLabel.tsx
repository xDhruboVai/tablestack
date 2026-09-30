/** "(02) Selected work" label used to open every section. */
export default function SectionLabel({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="eyebrow text-accent" data-reveal="scramble">
        ({index})
      </span>
      <span className="eyebrow" data-reveal="scramble">
        {label}
      </span>
    </div>
  );
}
