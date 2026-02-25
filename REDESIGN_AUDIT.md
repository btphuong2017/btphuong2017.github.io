# Portfolio Redesign — Repository Audit (Step A)

## 1. Repository structure

```
portfolio/
├── .github/workflows/     # CI (nextjs.yml)
├── public/               # avatar.jpg, static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root: fonts, ThemeProvider, metadata
│   │   ├── page.tsx      # Redirect / → /vi
│   │   ├── globals.css   # Tailwind, shadcn theme, keyframes
│   │   └── [locale]/
│   │       ├── layout.tsx  # I18nProvider, AppHeader, main, AppFooter
│   │       └── page.tsx    # Hero, Experience, Projects, Skills
│   ├── components/ui/    # shadcn: avatar, badge, button, card, separator, tabs
│   ├── core/
│   │   ├── config/site.ts
│   │   └── types/index.ts
│   ├── data/
│   │   ├── profile.json
│   │   ├── experience.json
│   │   ├── projects.json
│   │   └── skills.json
│   ├── features/home/
│   │   ├── HeroSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── SkillsSection.tsx
│   ├── i18n/
│   │   ├── routing.ts    # next-intl defineRouting (en, vi)
│   │   └── request.ts    # (present but not used for static export)
│   ├── lib/utils.ts
│   ├── messages/
│   │   ├── en.json
│   │   └── vi.json
│   ├── shared/
│   │   ├── components/   # AppHeader, AppFooter, Section, Container, SectionHeader, ContentCard, Tag, ThemeProvider
│   │   ├── context/I18nContext.tsx
│   │   └── utils/cn.ts
│   └── middleware.ts     # Neutral next() for static export
├── next.config.ts        # output: "export"
├── package.json
├── STYLEGUIDE.md
└── README.md
```

## 2. Framework & stack

| Area | Choice |
|------|--------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Export** | Static (`output: "export"`) — GitHub Pages compatible |
| **Routing** | `[locale]` (en | vi), root redirect to /vi |
| **Styling** | Tailwind CSS 4, shadcn/ui (radix), tw-animate-css |
| **Fonts** | Geist Sans, Geist Mono (next/font) |
| **i18n** | Custom `I18nContext` + `messages/{en,vi}.json` (no next-intl server APIs) |
| **Theme** | next-themes (light/dark), CSS variables in globals.css |

## 3. Page layout system

- **Root layout**: `<html>` + `<body>` with fonts and `ThemeProvider`.
- **Locale layout**: Loads `messages/{locale}.json`, wraps with `I18nProvider`; structure: header → main → footer.
- **Sections**: `Section` (py-12/16/20, border-t) → `Container` (max-w-screen-2xl, px-4) → content.
- **Section headers**: `SectionHeader` with optional label pill, title, description; align left/center.
- **Cards**: shadcn `Card` with `rounded-xl border border-border bg-card/80`; `ContentCard` for skills.

## 4. i18n approach

- **Locales**: `en`, `vi` (default `vi`), prefix always (`/en`, `/vi`).
- **Messages**: Flat namespaces in JSON (`hero`, `nav`, `footer`, `experience`, `projects`, `skills`); nested keys (e.g. `hero.stats.years`).
- **Usage**: `useTranslations(namespace)` returns `t(key)`; all UI strings from messages; profile/titles from `profile.json` or inline where needed.
- **Static export**: No server i18n; locale from URL segment; messages loaded in layout by dynamic import.

---

## 5. Top UX issues

1. **No clear “why you” above the fold** — Hero states role but doesn’t lead with architecture/leadership impact (e.g. “Architect of Micro Frontend”, “Led 8 developers”).
2. **Metrics buried in hero** — 8+, 3+, 15+ are in hero only; not surfaced as a dedicated “impact” section for quick scanning.
3. **No About** — Missing a short, architecture-oriented narrative that differentiates from generic “senior developer”.
4. **Projects feel like a list** — No problem/solution/impact framing; no visual hierarchy for case-study style (screenshot placeholder, problem, solution, impact).
5. **No strong Contact CTA** — Footer has contact info but no prominent “Let’s talk” or “Download CV” block.
6. **No Download CV** — CV exists in repo but no visible CTA to download.
7. **Navigation doesn’t reflect new hierarchy** — When we add Impact and About, nav needs to stay clear and scannable.

## 6. Top UI / visual issues

1. **Hero stats look like an afterthought** — Same weight as body; could be distinct “impact cards” with icons/labels.
2. **Project cards are uniform** — No place for screenshot/visual, no clear “problem → solution → impact” layout.
3. **Skills are one flat grid** — No grouping by “Architecture / Frameworks / DevOps / Performance / Backend” as requested.
4. **Section rhythm is good but could breathe more** — Slightly more separation between “Impact” and “Experience” would help hierarchy.
5. **No sticky CTA** — On long scroll, no persistent “Contact” or “Projects” CTA.
6. **Motion underused** — Keyframes exist (fadeInUp, etc.) but sections don’t use them for gentle reveal.

## 7. Top content / storytelling issues

1. **Hero is generic** — “8+ years building high-performance web applications” doesn’t say Micro Frontend, Nx, multi-tenant, or team size.
2. **Experience bullets are good but not framed** — Not consistently in Action + Tech + Impact + Scale format.
3. **Projects lack problem/solution** — Summaries describe what it is, not the problem solved and measurable impact.
4. **No evidence-based differentiator** — Phrases like “enterprise-scale” appear without concrete scale (e.g. 60-person program, 3 portals).
5. **Profile title** — “Senior Frontend Developer & Team Lead” is fine but could be “Frontend Architect & Team Lead” to match target role.

---

*Next: REDESIGN_PLAN.md (Step B)*
