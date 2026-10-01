# SEO owner handoff

Written 1 October 2026. Goal: help people who search for "tablestack", "table stack", "tablestack bd" or
"table stack bd" find this site, especially in Bangladesh. Nothing here promises a ranking; it removes
the things that were holding the site back and gives Google clear, consistent facts.

Nothing in this document has been deployed. The code changes are in the repository, uncommitted.

## 1. Canonical domain

**Chosen: `https://tablestackbd.com` (no www).**

Why: the owner chose it on 1 October 2026. Both hosts worked equally before, so there was no technical
reason to prefer one.

What the live site did before this change (checked 1 October 2026):

| Request | Result |
| --- | --- |
| `https://tablestackbd.com/` | 200 |
| `https://www.tablestackbd.com/` | 200 (same content, no redirect) |
| `http://` versions of both | 308 to the `https://` version of the same host |
| Canonical tag, `og:url`, sitemap and robots.txt | all pointed at `https://www.tablestackbd.com` |

So Google could reach two copies of every page, and the site named the www copy as the real one while
people were being sent to the non-www one.

What the code now does:

- Canonical tags, `og:url`, sitemap, robots.txt and structured data all use `https://tablestackbd.com`.
- `next.config.ts` permanently redirects (308) any request on `www.tablestackbd.com` to the same path
  and query string on `tablestackbd.com`.

## 2. Hosting changes for the owner (Vercel dashboard)

These cannot be done from the repository.

1. **Vercel → Project → Settings → Domains.** Keep both `tablestackbd.com` and `www.tablestackbd.com`
   attached. Set `tablestackbd.com` as the primary domain and set `www.tablestackbd.com` to
   "Redirect to tablestackbd.com" (308). The code redirect already covers this; doing it in the
   dashboard too is the standard setup and works at the edge.
2. **Do not** add a redirect from `tablestackbd.com` to `www` anywhere, or the two will loop.
3. **Environment variables.** Preview deployments are now marked `noindex` automatically using Vercel's
   built-in `VERCEL_ENV`. Nothing to configure.

## 3. URLs

Sitemap: **`https://tablestackbd.com/sitemap.xml`** (referenced from `https://tablestackbd.com/robots.txt`).

Pages in the sitemap (all return 200 and name themselves as canonical):

- `https://tablestackbd.com/`
- `https://tablestackbd.com/work`
- `https://tablestackbd.com/work/smashed-burgers`
- `https://tablestackbd.com/work/pinewood`
- `https://tablestackbd.com/about`
- `https://tablestackbd.com/contact`
- `https://tablestackbd.com/why-tablestack`
- `https://tablestackbd.com/faq`
- `https://tablestackbd.com/blog`
- `https://tablestackbd.com/blog/how-much-does-a-website-cost-in-bangladesh`

Deliberately not in the sitemap: `/portfolio` and `/services` (redirects), `/api/contact`, the 404 page.

`lastmod` is only given for the blog post, which has a real date. The other pages have no reliable
"last changed" date, and Google's guidance is to leave it out rather than guess.

## 4. Brand name

- Primary name everywhere: **TableStack**.
- "Table Stack" and "TableStack BD" are sent to search engines as alternate names only
  (`alternateName` in the structured data) and mentioned once in the FAQ. They are not used as the brand.
- The domain itself (`tablestackbd.com`) is what supports "TableStack BD" as a variant. If the company
  never uses "TableStack BD" in its own materials, remove it from `altNames` in `content/site.ts`.

## 5. Facts used in the structured data

Everything below came from the owner. Please confirm each line is correct and public:

| Field | Value |
| --- | --- |
| Name | TableStack |
| Alternate names | Table Stack, TableStack BD |
| Website | https://tablestackbd.com |
| Email | tablestackbd@gmail.com |
| Phone | +880 1716-934401 |
| Location | Dhaka, Bangladesh (city only, no street address) |
| Official profile | https://www.facebook.com/share/14vDpitJUjH/ |
| Logo | https://tablestackbd.com/logo.png (512 x 512) |

The business is described as an `Organization`, not a `LocalBusiness`, because there is no public street
address or opening hours. If the company gets an office that clients can visit, switch the type and add
the full address.

## 6. Owner facts still needed

- **Facebook page URL.** The link given is a share link (`facebook.com/share/...`). The permanent page
  address (`facebook.com/yourpagename`) is better for `sameAs`. Send it and replace it in `content/site.ts`.
- **Other official profiles** (LinkedIn company page, Instagram, GitHub organisation), if any exist.
- **Final logo.** `public/logo.png` and `app/icon.svg` are the current stacked-layers mark; the icon file
  is still commented as a placeholder. Replace both when the final logo exists.
- **Share image.** `/opengraph-image` is generated text on the brand background. A designed 1200 x 630
  image would look better in link previews.
- **Legal company name and registration**, if the business is registered. Not published anywhere now.
- **Blog post prices.** The market ranges in the cost article are rough estimates written as a guide.
  Review them against real quotes before promoting the post.
- **Project permission.** Confirm Smashed Burgers and Pinewood are happy to be named as client work.
- **Team phone numbers.** Personal WhatsApp numbers are public on the About page. Confirm each person agrees.

## 7. After deployment: Google Search Console

1. Go to https://search.google.com/search-console and add a **Domain property** for `tablestackbd.com`.
   It verifies with a DNS TXT record at the domain registrar and covers www, non-www, http and https.
2. Sitemaps → submit `https://tablestackbd.com/sitemap.xml`.
3. URL Inspection → inspect `https://tablestackbd.com/` → "Request indexing". Repeat for `/about`,
   `/work` and `/contact`.
4. A week later, check Pages → "Why pages aren't indexed". The www URLs should appear under
   "Page with redirect". That is expected.
5. Performance → filter queries containing "tablestack" and "table stack" to watch branded searches.

Optional but useful for local visibility: create a **Google Business Profile** as a service-area
business (no street address shown), with the same name, phone and website as above. Do the same on Bing
Webmaster Tools (it can import from Search Console).

## 8. Post-deployment checks

Run these against the live site after the deploy finishes:

```bash
curl -sI https://www.tablestackbd.com/work?x=1 | grep -i -E "HTTP|location"
```

Expected: `308` and `location: https://tablestackbd.com/work?x=1`.

```bash
curl -s https://tablestackbd.com/ | grep -o '<link rel="canonical"[^>]*'
```

Expected: `href="https://tablestackbd.com"`.

```bash
curl -s https://tablestackbd.com/robots.txt
```

Expected: `Allow: /` and `Sitemap: https://tablestackbd.com/sitemap.xml`.

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://tablestackbd.com/this-page-does-not-exist
```

Expected: `404`.

Then:

- Paste `https://tablestackbd.com/` into https://validator.schema.org and confirm one `Organization`
  and one `WebSite` with no errors. (Google's Rich Results Test does not check site-name markup.)
- Paste `https://tablestackbd.com/faq` into https://search.google.com/test/rich-results.
- Share the home page link in WhatsApp or Facebook and check the preview shows the new title.

## 9. What was verified, and where

**Verified locally on a production build (`next build` + `next start`), 1 October 2026:**

- Type check and build pass.
- All 10 sitemap URLs return 200, with unique titles and descriptions, exactly one `<h1>`, a self
  canonical, share tags with an image, and their text present in the server-rendered HTML.
- No `noindex` and no `X-Robots-Tag` on public pages. The 404 page returns a real 404 and is `noindex`.
- www host redirects with 308, keeping path and query. `/portfolio` and `/services` redirect.
- Home page JSON-LD parses and contains one `Organization` and one `WebSite`, linked by `@id`.
- `/logo.png`, `/icon.svg` and `/opengraph-image` return 200.
- No meta keywords tag. The word "softwares" no longer appears.

**Verified on the live site before this change (so it describes the old deployment):**

- Both hosts returned 200; no `X-Robots-Tag`; robots.txt allowed everything; unknown URLs returned 404.

**Not verified:**

- Anything about the new code in production. It has not been deployed.
- Google's index status for the domain. That needs Search Console access.
- Schema Markup Validator and Rich Results Test, which need a public URL with the new code.
- The repository has no lint script or automated tests, so none were run.
