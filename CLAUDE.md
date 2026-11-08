# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio of Bùi Thanh Phương: one page per locale, in this default order: map (first screen),
VELA drawing, other sheets, experience table, skills, contact. English and Vietnamese. Single theme.
Static export deployed to GitHub Pages. The spec is `docs/concepts/DIRECTION.md`; its "Facts" section
is a hard limit on all copy.

## Tech stack

- Next.js 16 App Router, `output: "export"`, `trailingSlash: true`. No server runtime.
- React 19, TypeScript 5. Plain CSS: `src/app/globals.css` (tokens) and CSS modules. No Tailwind, no UI kit.
- i18n is hand-rolled: locales `en` and `vi`, default `en`, always prefixed. No library.
- Fonts through `next/font/google`: Bricolage Grotesque (display, 800), Be Vietnam Pro (400, 600).

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm run lint     # one known warning: the GTM inline script, kept as is
npm run check    # src/content/career.check.ts; needs Node 22.18+
```

Node 20+ for everything else. After deleting a route, delete `.next/` too: stale types there break the build.

## Structure

```
src/
├── app/
│   ├── Document.tsx          # <html lang>, fonts, GTM: shared by every root layout
│   ├── Redirect.tsx          # script and no-JS redirect to a locale
│   ├── (root)/               # root layout and page for /
│   ├── [locale]/             # root layout (real lang in static HTML), page, for/[reader]/page
│   ├── global-not-found.tsx  # out/404.html
│   └── globals.css           # tokens, reset, type, .wrap, .section, .reveal
├── content/
│   ├── career.ts             # dates, lines, stations, roles, VELA layers, contact; axisPosition()
│   ├── career.check.ts       # npm run check
│   └── metadata.ts           # per-locale metadata, canonical, noindex
├── features/
│   ├── sections/             # Page (nav, order, footer), order.ts, Hero, Sheets, plate.ts, Experience, Skills, Contact
│   ├── map/CareerMap.tsx     # two-line map
│   └── drawing/Drawing.tsx   # VELA drawing
├── i18n/routing.ts           # locale list, default
├── lib/locale-redirect.ts    # redirect script, remembers the locale in localStorage
└── messages/                 # vi.json (defines the type), en.json, index.ts
```

## Conventions

- **Strings live in `src/messages/{vi,en}.json`, in both. Dates and structure live in `src/content/career.ts`.**
  Components receive their slice of messages as a prop `m`. Nothing reads a global.
- **Copy:** first person, NFC, no motive the CV doesn't state. Check every claim against `DIRECTION.md`.
- **Server components by default.** Client code only for the map's line choice and the drawing.
- **Everything renders at build:** no route handlers, server actions or request-time data.
- **Colour means something:** `--inside` blue, `--outside` red, `--sun` interchange or a whole field.
  House style in `DIRECTION.md`: no eyebrows, pills, card grids, gradients or shadows; lines only in the
  drawing, map and real tables; headlines at most two lines; square corners.
- **Motion:** transform and opacity only, CSS for entrances (`.reveal`), nothing hidden without JS, and
  `prefers-reduced-motion` keeps all content.
- **Phone is its own composition,** designed at 390 alongside desktop.
- **Tab order equals visual order:** don't reorder with CSS.
- Imports use the `@/*` alias.

## Deployment

A push to `master` deploys through `.github/workflows/nextjs.yml`. Don't change the workflow.

## More docs

- `docs/concepts/`: spec, research, prototypes, project state.
- `.claude/docs/`: written for the old site; its file paths are out of date.
