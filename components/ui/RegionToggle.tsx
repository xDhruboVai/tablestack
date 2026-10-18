"use client";

import { useRouter } from "next/navigation";
import { REGION_COOKIE, type Region } from "@/content/pricing";

const options: { region: Region; label: string }[] = [
  { region: "us", label: "USD ($)" },
  { region: "bd", label: "BDT (৳)" },
];

/** USD / taka switch on /pricing. The pick is a cookie, so the page and the contact form both use it. */
export default function RegionToggle({ region }: { region: Region }) {
  const router = useRouter();

  const pick = (next: Region) => {
    document.cookie = `${REGION_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <div role="group" aria-label="Currency" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.region} type="button" className="chip" aria-pressed={region === o.region} onClick={() => pick(o.region)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
