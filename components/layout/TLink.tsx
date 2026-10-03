"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionNav } from "./Transition";
import { prefersReducedMotion } from "@/lib/motion";

type Props = ComponentProps<typeof Link> & { href: string };

/** Internal link that plays the page transition. Falls back to normal behavior for new tabs, hashes and external URLs. */
export default function TLink({ href, onClick, ...rest }: Props) {
  const { navigate } = useTransitionNav();
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target && rest.target !== "_self") return;
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return;
    e.preventDefault();
    // Already on this page: glide back to the top instead of doing nothing
    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }
    navigate(href);
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
