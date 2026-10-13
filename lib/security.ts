import "server-only";

/** Shared request checks for the API routes. */

/** The visitor's address as the hosting platform reports it. */
export const clientOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";

/**
 * True only when a browser on this site sent the request. Other sites, and scripts that don't send an
 * Origin header, are turned away, so the form and the admin actions can't be driven from elsewhere.
 */
export function sameOrigin(req: Request): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Reads a JSON object from the request, refusing anything that isn't JSON or is larger than `maxBytes`.
 * Returns null when the body is unusable.
 */
export async function readJson<T extends object>(req: Request, maxBytes: number): Promise<T | null> {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return null;
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return null;
  let text: string;
  try {
    text = await req.text();
  } catch {
    return null;
  }
  if (Buffer.byteLength(text) > maxBytes) return null;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? (value as T) : null;
  } catch {
    return null;
  }
}

/**
 * A simple counter per visitor address: after `max` hits, that address is blocked until the window ends.
 * Kept in memory, so it is per server instance. It slows a burst; it is not a full lockout.
 */
export function createLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; until: number }>();
  const live = (key: string) => {
    const h = hits.get(key);
    if (h && h.until <= Date.now()) hits.delete(key);
    return hits.get(key);
  };
  return {
    blocked: (key: string) => (live(key)?.count ?? 0) >= max,
    hit: (key: string) => {
      if (hits.size > 5000) hits.clear();
      const h = live(key);
      hits.set(key, { count: (h?.count ?? 0) + 1, until: h?.until ?? Date.now() + windowMs });
    },
    clear: (key: string) => void hits.delete(key),
  };
}

// Control characters and the invisible "text direction" marks that can be used to disguise text.
// Joiners used by Bangla and other scripts (U+200C, U+200D) are kept.
const UNSAFE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩﻿]/g;

/** A single line of text: no control characters, no line breaks, trimmed and capped. */
export const oneLine = (v: unknown, max: number) => (typeof v === "string" ? v.replace(UNSAFE, "").replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Text that may run over several lines: no control characters, trimmed and capped. */
export const multiLine = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(UNSAFE, "").trim().slice(0, max) : "");

/**
 * Spreadsheets run a cell that starts with = + - or @ as a formula. A leading apostrophe makes the
 * spreadsheet keep it as plain text.
 */
export const sheetSafe = (v: string) => (/^[=+\-@]/.test(v) ? "'" + v : v);
