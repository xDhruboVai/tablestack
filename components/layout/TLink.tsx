"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionNav } from "./Transition";

type Props = ComponentProps<typeof Link> & { href: string };

/** Internal link that plays the page transition. Falls back to normal behavior for new tabs, hashes and external URLs. */
export default function TLink({ href, onClick, ...rest }: Props) {
  const { navigate } = useTransitionNav();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target && rest.target !== "_self") return;
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
