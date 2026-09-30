import { integrations } from "@/content/site";

/** The tools we build with, rolling right to left (CSS loop, pauses on hover, still under reduced motion). */
export default function ToolMarquee({ className = "" }: { className?: string }) {
  const doubled = [...integrations, ...integrations];
  return (
    <>
      <div className={`marquee ${className}`} aria-hidden="true">
        <div className="marquee-track">
          {doubled.map((name, i) => (
            <span key={i} className="flex items-center whitespace-nowrap font-display text-[clamp(2rem,4vw,3.6rem)] font-bold italic leading-none tracking-[-0.04em]">
              <span className="px-6 md:px-10">{name}</span>
              <span className="text-[0.4em] not-italic text-accent">✳</span>
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {integrations.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </>
  );
}
