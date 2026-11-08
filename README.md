# Portfolio

Personal site of Bùi Thanh Phương. One page, English and Vietnamese: a career drawn as two lines, the people inside a company and the people outside it, then the biggest interchange (VELA) taken apart.

Next.js 16 static export on GitHub Pages. Server components by default, plain CSS, no UI or i18n libraries.

## Run it

Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000, / redirects to a locale
npm run build    # static site in out/
npm run lint
npm run check    # dates-to-position and fact limits on the copy; needs Node 22.18+
```

## Edit the content

| To change | Edit |
|---|---|
| Any sentence, in both languages | `src/messages/vi.json`, `src/messages/en.json` (a key missing from one fails the build) |
| Dates, employers, stations, lines, email, phone, LinkedIn, CV path | `src/content/career.ts` |
| Section order, per reader route | `src/features/sections/order.ts` |
| Colours, spacing, type steps | `:root` in `src/app/globals.css` |

`docs/concepts/DIRECTION.md` has the facts the copy must stay inside.

## Update the CV

The PDF in `public/` is printed from `docs/cv/cv.html`. Edit the HTML, then print it with Chrome (keeps the file name the site links to):

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer \
  --virtual-time-budget=10000 --print-to-pdf=public/CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf \
  "file:///D:/Works/Pet Projects/portfolio/docs/cv/cv.html"
```

Check that it is still two pages.

## Routes

- `/vi/`, `/en/`: the page. `/` and unknown paths redirect by script to the visitor's locale.
- `/{locale}/for/recruiter/`, `engineer`, `lead`: the same sections in another order. Not linked from the nav, `noindex`, canonical is the locale home.

## Deploy

Pushing to `master` builds and deploys through `.github/workflows/nextjs.yml`.

## Restore the previous site

The site before this redesign is tagged `pre-creative-redesign` (local tag on commit `ce9f5a5`, which is also on `origin/feat/portfolio-redesign`):

```bash
git switch -c restore-old-site pre-creative-redesign
```
