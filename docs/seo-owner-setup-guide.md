# SEO setup guide for the owners

Checked 1 October 2026. Companion to `docs/seo-owner-handoff.md`.

Target Google searches: **table stack, tablestack, tablestack bd, table stack bd**.

Nothing in this guide was done for you. No external account, DNS record, hosting setting or business
profile was touched. Nothing here promises a ranking.

Labels used below:

- **[Repo]** verified by reading the repository
- **[Live]** verified by requesting the public site on 1 October 2026
- **[Owner]** only you can know or do this
- **[Unknown]** could not be checked

---

## 1. Deployment and domain facts

### Framework and hosting

| Fact | Value | Evidence |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript | [Repo] `package.json` |
| Hosting | Vercel | [Live] response header `Server: Vercel`, plus `X-Vercel-Id` |
| Git remote | `github.com/xDhruboVai/tablestack`, branch `main` | [Repo] `git remote -v` |
| Deployed commit | Matches `5d7a6fc` ("SEO"), the latest on `origin/main` | [Live] the new title, canonical, sitemap and pages are all being served |
| Nameservers | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` | [Live] DNS lookup |
| DNS provider | Vercel DNS, going by the nameservers | [Live] |
| Domain registrar | [Unknown]. Nameservers show where DNS is hosted, not where the domain was bought | |
| Which Vercel account owns the project and domain | [Owner] | |

### Addresses

- Canonical home page: **`https://tablestackbd.com/`**
- Sitemap: **`https://tablestackbd.com/sitemap.xml`**
- Robots file: `https://tablestackbd.com/robots.txt`

Public pages, all returning 200 [Live]:

| Page | Address |
| --- | --- |
| Home | `https://tablestackbd.com/` |
| About Us | `https://tablestackbd.com/about` |
| Contact | `https://tablestackbd.com/contact` |
| Work | `https://tablestackbd.com/work` |
| Smashed Burgers | `https://tablestackbd.com/work/smashed-burgers` |
| Pinewood | `https://tablestackbd.com/work/pinewood` |
| Why TableStack | `https://tablestackbd.com/why-tablestack` |
| FAQ | `https://tablestackbd.com/faq` |
| Blog | `https://tablestackbd.com/blog` |
| Blog post | `https://tablestackbd.com/blog/how-much-does-a-website-cost-in-bangladesh` |

### Redirect tests [Live]

| Request | Result |
| --- | --- |
| `https://tablestackbd.com/` | 200 |
| `https://www.tablestackbd.com/` | 308 to `https://tablestackbd.com/` |
| `https://www.tablestackbd.com/work?x=1` | 308 to `https://tablestackbd.com/work?x=1` (path and query kept) |
| `http://tablestackbd.com/` | 308 to `https://tablestackbd.com/` |
| `http://www.tablestackbd.com/` | 308 to `https://www.tablestackbd.com/`, which then 308s to the non-www address (two hops) |
| `/portfolio` | 308 to `/work` |
| `/services` | 308 to `/#services` |
| `/nope-xyz` (made-up address) | 404 |

### Production findings [Live]

- **Robots:** `User-Agent: *`, `Allow: /`, and the sitemap line. Nothing is blocked.
- **Noindex:** no `noindex` meta tag and no `X-Robots-Tag` header on the home page or About.
- **Canonical:** home page declares `https://tablestackbd.com`; About declares `https://tablestackbd.com/about`.
- **Title:** "TableStack | Web Development & AI Solutions in Bangladesh".
- **Structured data on the home page:** one `Organization` and one `WebSite`, with alternate names
  "Table Stack" and "TableStack BD".
- **Sitemap:** 10 addresses, all on `tablestackbd.com`; one `lastmod` (the blog post).
- **Logo and share image:** `/logo.png` and `/opengraph-image` return 200.
- The word "softwares" no longer appears on the home page.

### Differences between the repository and production

None found in the things checked above.

One document is out of date: `docs/seo-owner-handoff.md` section 9 says the changes are not deployed.
They now are.

One small thing worth tidying: the two-hop redirect for `http://www`. Setting the www redirect in the
Vercel dashboard (step B2 below) usually makes it one hop. It is not harmful as it is.

### Not checked

- [Unknown] Whether Google has indexed any page. That needs Search Console.
- [Unknown] Whether a Search Console property exists already.
- [Unknown] Schema Markup Validator result. Run it yourself (step A3).
- [Unknown] Who has access to Vercel, the registrar and the Gmail account.

---

## 2. Questions for the owners

Please answer these. Do not send passwords, API keys, recovery codes or secret files to anyone.

1. Who can log in to the Vercel project that serves `tablestackbd.com`? Who can edit its DNS records?
2. Where was the domain bought (the registrar), and whose account is it in?
3. Has anyone already added the site to Google Search Console? If so, which Google account?
4. Is "TableStack" the exact public name? Do you ever write "TableStack BD" on your own materials
   (Facebook page name, invoices, email signature)?
5. What is the permanent address of the Facebook page (not a share link)? Are there official LinkedIn,
   Instagram or GitHub organisation pages?
6. Are these correct and fine to publish: email `tablestackbd@gmail.com`, phone `01716934401`,
   location "Dhaka, Bangladesh"?
7. Do you meet customers in person, at your place or theirs? Or is all work done online?
8. Are Smashed Burgers and Pinewood paid client work, and have both agreed to be named publicly?

---

## 3. Google Search Console

Google's instructions: [Add a website property](https://support.google.com/webmasters/answer/34592) and
[Verify your site ownership](https://support.google.com/webmasters/answer/9008080).

### Add and verify a Domain property

A Domain property covers www and non-www, http and https in one place.

1. Sign in at https://search.google.com/search-console with the Google account the company will keep
   (for example the `tablestackbd@gmail.com` account).
2. Choose **Add property**, pick **Domain**, type `tablestackbd.com` (no `https://`, no `www`), and continue.
3. Google shows a **TXT record** that starts with `google-site-verification=`. Copy the whole value.
   It is generated for your account; nobody else can give it to you.
4. In a new tab, open the place your DNS is managed. The nameservers point to Vercel, so this should be
   **Vercel → your team → Domains → tablestackbd.com → DNS Records**. If the domain is not listed in any
   Vercel account you can open, stop and find out who owns it (question 1).
5. Add a record: **Type** `TXT`, **Name** `@` (or leave empty for the root), **Value** the string from
   step 3, TTL default. Save.
6. Back in Search Console, press **Verify**. If it fails, wait 10 to 60 minutes and press it again;
   DNS changes can take a while.
7. **Keep the TXT record forever.** Removing it removes your access.
8. Settings → Users and permissions → add the other two team members, so access does not depend on
   one person.

### After verifying

**Submit the sitemap.** Sitemaps → enter `sitemap.xml` → Submit. The status should become "Success" with
10 discovered pages. ([Sitemaps report](https://support.google.com/webmasters/answer/7451001))

**Inspect the key pages.** Paste each address into the search bar at the top
([URL Inspection tool](https://support.google.com/webmasters/answer/9012289)):

- `https://tablestackbd.com/`
- `https://tablestackbd.com/about`
- `https://tablestackbd.com/contact`
- `https://tablestackbd.com/work`
- `https://tablestackbd.com/work/smashed-burgers`
- `https://tablestackbd.com/work/pinewood`

How to read the result:

| Line | What you want | If not |
| --- | --- | --- |
| "URL is on Google" / "URL is not on Google" | On Google. "Not on Google" is normal for a new site | Request indexing (below) |
| Crawl allowed? | Yes | "No" means robots.txt is blocking; tell the developer |
| Page fetch | Successful | An error means Google could not load the page; test it yourself, then tell the developer |
| Indexing allowed? | Yes | "No: noindex detected" means a tag is blocking it |
| User-declared canonical | The same non-www address you inspected | Anything else is a bug in the site |
| Google-selected canonical | Same as the user-declared one | If Google picked the www address, check step B2, then wait; it usually corrects itself after the redirect is seen |

**Stored report versus live test.** The first screen shows what Google saw the last time it visited,
which may be days old or never. **Test live URL** fetches the page right now. Use the live test to
confirm a fix worked; use the stored report to see what is actually in Google's index.

**Request indexing.** On each of the six pages, press **Request indexing** once. There is a daily limit
and pressing it repeatedly does not speed anything up.
([Ask Google to recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl))

**Check for problems.**

- Indexing → Pages ([Page indexing report](https://support.google.com/webmasters/answer/7440203)).
  www addresses listed under "Page with redirect" are expected. Investigate anything under
  "Blocked by robots.txt", "Excluded by noindex" or "Server error".
- Security & Manual actions → Manual actions: should say "No issues detected".
  ([Manual actions](https://support.google.com/webmasters/answer/9044175))
- Security & Manual actions → Security issues: should say "No issues detected".
  ([Security issues](https://support.google.com/webmasters/answer/9044101))

How Google shows a site's name in results is described in
[Site names](https://developers.google.com/search/docs/appearance/site-names). The site already supplies
what that page asks for (WebSite data with name and alternate names on the home page). Google decides
the rest and it can take weeks.

---

## 4. Public identity

### Use the same details everywhere

| Item | Value | Status |
| --- | --- | --- |
| Name | TableStack | [Repo] and [Live]; confirm in question 4 |
| Website | `https://tablestackbd.com` | [Live] |
| Email | `tablestackbd@gmail.com` | [Repo]; confirm in question 6 |
| Phone | `+880 1716-934401` | [Repo]; confirm in question 6 |
| Location | Dhaka, Bangladesh | [Repo]; confirm in question 6 |
| Logo | `https://tablestackbd.com/logo.png` | [Live]. Still the placeholder mark; replace when final |

On every official profile (Facebook page, LinkedIn company page, GitHub organisation, Instagram), use
exactly this name, the same logo, and link to `https://tablestackbd.com`. Then send the profile
addresses to the developer so they can be added to the site's structured data.

### Short bio (draft)

> TableStack is a small web development team in Dhaka, Bangladesh. We design and build websites, web
> apps, online shops, databases and AI tools for businesses. tablestackbd.com

Every claim in it is on the site today. Shorten to the first sentence where space is tight.

### Google Business Profile: are you eligible?

Google's rule ([Guidelines for representing your business](https://support.google.com/business/answer/3038177)):
a business must make **in-person contact with customers during its stated hours**. Businesses that only
work online are not eligible. A team that visits clients at their premises can qualify as a
service-area business and hide its address
([service-area businesses](https://support.google.com/business/answer/9157481)).

- If your answer to question 7 is "we meet clients in person", create a profile as a service-area
  business, with no address shown, using the details in the table above.
- If the answer is "everything is online", **do not create one**, and do not list a home or a rented
  desk as an office. Profiles that break the guidelines get suspended.

### Asking a client for permission to credit the work

> Hi [Name],
>
> We'd like to show the [Business] website in our portfolio at tablestackbd.com, with your business
> name, a few screenshots and a link to the live site. Could you reply to confirm you're happy with
> that? If you'd rather we leave anything out, tell us and we will.
>
> If you're willing, a one-line "Website by TableStack" link in your site's footer would also help us.
> No pressure either way.
>
> Thanks,
> [Your name], TableStack

Keep the written reply.

---

## 5. Measuring the four searches

Google's guide: [Performance report](https://support.google.com/webmasters/answer/7576553).

Search Console → Performance → Search results.

1. Date range: **Last 28 days**. Tick all four boxes: Total clicks, Total impressions, Average CTR,
   Average position.
2. **+ Add filter → Query → Custom (regex)** and enter: `table ?stack`
   This matches "tablestack", "table stack", "tablestack bd" and "table stack bd". Look at the
   **Queries** table underneath to see each one separately.
3. **+ Add filter → Country → Bangladesh.**
4. **+ Add filter → Device → Mobile**, note the numbers, then switch to **Desktop** and note them again.

Record once a week:

| Week | Query | Device | Impressions | Clicks | CTR | Avg. position |
| --- | --- | --- | --- | --- | --- | --- |
| | tablestack | Mobile | | | | |
| | tablestack | Desktop | | | | |
| | table stack | Mobile | | | | |
| | … | | | | | |

How to read it:

- Expect little or no data from before the property was added, and a lag of about two days.
- **A missing row does not mean nobody searched.** Search Console hides very rare queries for privacy,
  so brand searches on a new site often show nothing at first.
- "Average position" is an average over every time the site appeared. It is not a live rank.
- Searching Google yourself is not a measurement. Results change with your location, your device and
  your own history. No free tool gives an exact Google Bangladesh rank either.
- "table stack" as two words also means other things (furniture, other companies), so expect it to move
  slower than "tablestack".

---

## 6. Checklist

Indexing and brand clarity come first. More content comes last.

### A. Before the next deployment

| # | Action | Owner | Where | What to do | Needs first | Done when | If it fails |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | Answer the questionnaire | All three | Section 2 | Write the eight answers down and share them | Nothing | Answers shared in the team chat | Ask whoever set up the domain and Vercel |
| A2 | Confirm client permission | Nahin | Email or WhatsApp to both clients | Send the template in section 4 | Nothing | A written "yes" from each | Remove the client name, or the project, until they agree |
| A3 | Validate the structured data | Dihan or Saalim | https://validator.schema.org | Paste `https://tablestackbd.com/` and run | Nothing | One Organization and one WebSite, zero errors | Send a screenshot of the error to the developer |
| A4 | Send real profile links | Nahin | Facebook page settings | Copy the permanent page address, plus any LinkedIn or Instagram | Profiles exist | Links shared | Leave them out; no profile is better than a wrong one |
| A5 | Decide on "TableStack BD" | All three | Question 4 | If you never use it, ask the developer to remove it from `altNames` in `content/site.ts` | A1 | Decision recorded | Keep as is |
| A6 | Review blog prices | Dihan and Saalim | `/blog/how-much-does-a-website-cost-in-bangladesh` | Correct any price range that does not match what you see locally | Nothing | Ranges approved or edited | Ask the developer to soften or remove the list |

### B. After deployment (the current code is already live)

| # | Action | Owner | Where | What to do | Needs first | Done when | If it fails |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Verify Search Console | Whoever controls DNS | search.google.com/search-console and Vercel → Domains → DNS Records | Section 3, steps 1 to 7 | DNS access (A1) | Property shows "Ownership verified" | Wait an hour and retry. Check the TXT record has no extra spaces or quotes |
| B2 | Set the www redirect in Vercel | Vercel account owner | Vercel → Project → Settings → Domains | `tablestackbd.com` primary; `www.tablestackbd.com` set to redirect to it | Vercel access | `https://www.tablestackbd.com/` shows 308 in the Domains list | Leave it; the code already redirects |
| B3 | Submit the sitemap | Same as B1 | Search Console → Sitemaps | Enter `sitemap.xml`, Submit | B1 | Status "Success", 10 pages discovered | "Couldn't fetch" often clears within a day. Open the sitemap address in a browser to confirm it loads |
| B4 | Inspect six pages and request indexing | Same as B1 | Search Console → URL Inspection | Section 3 list; Test live URL, then Request indexing | B1 | Each shows "Indexing requested" | If the live test shows an error, send it to the developer |
| B5 | Check the three reports | Same as B1 | Pages; Manual actions; Security issues | Read each | B1, and a few days | No manual actions, no security issues | Follow the link Google gives in the report |
| B6 | Add teammates | Same as B1 | Search Console → Settings → Users and permissions | Add the other two as Full users | B1 | Three users listed | Nothing to fix; just retry |
| B7 | Align official profiles | Nahin | Each profile's edit page | Same name, logo, bio and website link (section 4) | A4 | Every profile links to `https://tablestackbd.com` | Fix whichever profile differs |
| B8 | Business Profile, only if eligible | Nahin | business.google.com | Section 4 rule. Service-area business, address hidden | A1 question 7 is "in person" | Profile verified by Google | If not eligible, skip this for good |

### C. Weekly

| # | Action | Owner | Where | What to do | Needs first | Done when | If it fails |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Record the four queries | One named person | Search Console → Performance | Section 5 filters; fill the table | B1 | A new row each week | No rows yet is normal early on. Keep checking weekly |
| C2 | Check indexed pages | Same | Search Console → Pages | Compare "Indexed" with the 10 sitemap pages | B3 | Count is stable or growing | Inspect any missing page and request indexing once |
| C3 | Check for warnings | Same | Search Console overview and email | Read any new message | B1 | Nothing new | Act on the message, or send it to the developer |
| C4 | Later, optional | All | The site | Add new case studies and blog posts when there is something real to show | Indexing is working | New page is in the sitemap | Not urgent |
