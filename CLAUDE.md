# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio site for Phuong Bui Thanh — a single-page, content-driven site
(Hero, Impact, Experience, Projects, Skills, About, Contact) with dark/light theme
and English/Vietnamese localization. Built as a **static export** and deployed to
GitHub Pages.

## Tech stack

- **Framework:** Next.js 16 (App Router), `output: "export"` — fully static, no server runtime
- **UI:** React 19, Tailwind CSS 4, shadcn/ui (new-york style), Radix UI, Lucide icons
- **i18n:** next-intl — locales `en` and `vi`, default `vi`, `localePrefix: "always"` (root `/` redirects to `/vi`)
- **Theming:** next-themes (dark/light)
- **Language:** TypeScript 5

## Commands

```bash
npm run dev      # dev server at http://localhost:3000 (root redirects to /vi)
npm run build    # static production build -> out/
npm run start    # serve the production build
npm run lint     # ESLint (eslint-config-next)
```

Node.js 20+ required.

## Structure

```
src/
├── app/
│   ├── layout.tsx          # root layout (fonts, ThemeProvider)
│   ├── page.tsx            # redirect("/vi")
│   ├── globals.css         # Tailwind + design tokens
│   └── [locale]/           # locale layout + home page
├── features/home/          # page sections (Hero, Experience, Projects, Skills, About, Contact, ImpactHighlights)
├── shared/
│   ├── components/         # Section, Container, SectionHeader, ContentCard, MetricCard, Tag, AppHeader, AppFooter, ThemeProvider
│   ├── context/            # I18nContext
│   └── utils/              # cn()
├── components/ui/          # shadcn/ui primitives
├── core/
│   ├── config/site.ts      # site metadata, locales, defaultLocale
│   └── types/              # shared TS types
├── data/*.json             # profile, experience, projects, skills — the site's content source
├── i18n/                   # routing.ts, request.ts
├── messages/               # en.json, vi.json — UI strings
├── lib/utils.ts            # cn() (shadcn)
└── middleware.ts           # next-intl locale middleware
```

## Conventions

- **Content is data, not markup.** Update `src/data/*.json` to change profile, experience,
  projects, or skills — do not hardcode content into section components.
- **UI strings are localized.** Any user-facing string belongs in `src/messages/{en,vi}.json`;
  add keys to **both** files. Content JSON in `src/data/` drives the same structure regardless of locale.
- **Follow the design system.** Reuse the typography/spacing/card patterns in `STYLEGUIDE.md` and
  the shared components (`Section`, `Container`, `SectionHeader`, card patterns) instead of ad-hoc classes.
- **Styling:** Tailwind utility classes + shadcn tokens (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `border-border`). Use `cn()` for conditional classes. Avoid heavy shadows/glows.
- **Imports:** use the `@/*` path alias (see `tsconfig.json` / `components.json`).
- **Static-export constraints** (`output: "export"`): no server components fetching at request time,
  no route handlers / server actions, no Next.js Image optimization (images are unoptimized).
  Everything must render at build time.

## Deployment

Pushed to GitHub Pages via `.github/workflows/nextjs.yml`. `npm run build` emits static files to `out/`.

## More docs

- `README.md` — quick start & structure
- `STYLEGUIDE.md` — design system (typography, spacing, cards, layout)
- `CUSTOMIZE.md` — how to populate content
- `.claude/docs/` — knowledge map, workflow, rules, open questions
