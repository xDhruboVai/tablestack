// Makes the picture shown when a link to the site is shared (assets/social/link-preview.jpg, 1200x630):
// the logo and headline on black, beside a tilted wall of the sites on the Work page.
//
// The picture is a saved file, so run this again after the projects, the headline or the logo change.
// It draws with the site's own fonts and styles, so the site has to be running locally:
//   1. npm run dev
//   2. npm install --no-save playwright-core      (once; it drives the Edge that is already on this computer)
//   3. node scripts/link-preview.mjs
import { chromium } from "playwright-core";

const SITE = "http://localhost:3000";
const OUT = process.argv[2] ?? "assets/social/link-preview.jpg";
const HEADLINE = ["Websites built", "around your", "<em>business.</em>"];
const ADDRESS = "tablestackbd.com";

const css = `
  nextjs-portal { display: none !important; }
  .lp { position: fixed; left: 0; top: 0; z-index: 99999; width: 1200px; height: 630px; overflow: hidden; background: #0a0a0a; color: #f2efea; font-family: var(--font-display); --bar: 22px; }
  .lp-wall { position: absolute; inset: 0; perspective: 1900px; }
  .lp-plane { position: absolute; left: 44%; top: -92%; width: 1500px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; transform: rotateX(54deg) rotateZ(-34deg); }
  .lp-col { display: grid; gap: 22px; align-content: start; }
  .lp-col:nth-child(2) { transform: translateY(-120px); }
  .lp-col:nth-child(3) { transform: translateY(-30px); }
  .lp-col:nth-child(4) { transform: translateY(-190px); }
  .lp .shot-win { border-radius: 10px; box-shadow: 0 0 0 1px rgb(255 255 255 / .12), 0 30px 60px -20px rgb(0 0 0 / .8); }
  .lp .shot-addr { min-width: 46%; font-size: 9px; }
  .lp-view { position: relative; aspect-ratio: 16 / 10; }
  .lp-view img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .lp-fade { position: absolute; inset: 0; background: linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 43%, rgb(10 10 10 / .5) 56%, transparent 70%), linear-gradient(0deg, #0a0a0a, transparent 20%); }
  .lp-copy { position: absolute; inset: 54px auto 54px 64px; display: flex; flex-direction: column; justify-content: space-between; }
  .lp-logo { display: flex; align-items: center; gap: 16px; font-size: 36px; font-weight: 800; letter-spacing: -0.045em; line-height: 1; }
  .lp-logo svg { width: 62px; height: 44px; }
  .lp h1 { margin: 0; font-size: 82px; font-weight: 800; line-height: 0.98; letter-spacing: -0.05em; }
  .lp em { font-style: normal; color: #e44935; }
  .lp-address { color: #b4aaa4; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
`;

const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
// Skips the first-visit loading screen, and keeps the light theme whatever this computer last used.
await context.addInitScript(() => {
  sessionStorage.setItem("ts-visited", "1");
  localStorage.removeItem("ts-mode");
});
const page = await context.newPage();
await page.goto(`${SITE}/work`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: css });

const count = await page.evaluate(
  async ({ headline, address }) => {
    // The sites, their addresses and the logo all come from the Work page itself, so the picture matches the site.
    const sites = [...document.querySelectorAll(".project-tile-win")].map((w) => ({
      host: w.querySelector(".shot-addr")?.textContent ?? "",
      src: w.querySelector("img")?.currentSrc ?? "",
    })).filter((s) => s.src);
    if (sites.length === 0) return 0;
    const six = Array.from({ length: 6 }, (_, i) => sites[i % sites.length]);
    const win = (s) => `<div class="shot-win"><div class="shot-bar"><span class="shot-dots"><i></i><i></i><i></i></span><span class="shot-addr">${s.host}</span><span></span></div><div class="lp-view"><img src="${s.src}" alt=""></div></div>`;
    const col = (order) => `<div class="lp-col">${order.map((i) => win(six[i])).join("")}</div>`;
    const mark = document.querySelector("header svg, nav svg")?.outerHTML ?? "";

    const el = document.createElement("div");
    el.className = "lp";
    el.innerHTML = `
      <div class="lp-wall"><div class="lp-plane">${col([4, 0, 2, 5, 1, 3])}${col([1, 3, 4, 0, 5, 2])}${col([2, 5, 0, 3, 1, 4])}${col([3, 1, 4, 2, 0, 5])}</div></div>
      <div class="lp-fade"></div>
      <div class="lp-copy">
        <div class="lp-logo">${mark}<span>TableStack</span></div>
        <h1>${headline.join("<br>")}</h1>
        <div class="lp-address">${address}</div>
      </div>`;
    document.body.appendChild(el);
    await Promise.all([...el.querySelectorAll("img")].map((i) => (i.complete ? 0 : new Promise((done) => { i.onload = i.onerror = done; }))));
    await document.fonts.ready;
    return sites.length;
  },
  { headline: HEADLINE, address: ADDRESS },
);

if (count === 0) {
  console.error("No projects found on the Work page. Is the site running, with at least one project switched on?");
  process.exitCode = 1;
} else {
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT, type: "jpeg", quality: 92, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`Saved ${OUT} with ${count} sites.`);
}
await browser.close();
