# Knowledge Map

Where things live and what to touch for common tasks.

## Content (edit these to change what the site says)

| Content | File |
|---|---|
| Name, title, bio, contacts, social links | `src/data/profile.json` |
| Work history | `src/data/experience.json` |
| Portfolio projects | `src/data/projects.json` |
| Skills by category | `src/data/skills.json` |
| Site metadata, locales, default locale | `src/core/config/site.ts` |
| UI strings (labels, nav, buttons) | `src/messages/en.json`, `src/messages/vi.json` |
| Avatar / logos / CV PDF | `public/` |

## Page composition

- Home page assembled in `src/app/[locale]/page.tsx` from section components in `src/features/home/`:
  `HeroSection`, `ImpactHighlightsSection`, `ExperienceSection`, `ProjectsSection`,
  `SkillsSection`, `AboutSection`, `ContactSection`.
- Sections have in-page anchor IDs (`home`, `experience`, `projects`, `skills`) used by header/footer nav.

## Layout & shared UI

- Root shell: `src/app/layout.tsx` (fonts, `ThemeProvider`), locale shell: `src/app/[locale]/layout.tsx`.
- Reusable building blocks: `src/shared/components/` — `Section`, `Container`, `SectionHeader`,
  `ContentCard`, `MetricCard`, `Tag`, `AppHeader`, `AppFooter`.
- shadcn primitives: `src/components/ui/` (avatar, badge, button, card, separator, tabs).

## i18n

- Routing: `src/i18n/routing.ts` (locales `en`/`vi`, default `vi`, prefix always).
- Request config: `src/i18n/request.ts`; middleware: `src/middleware.ts`.
- Root `/` → `/vi` redirect: `src/app/page.tsx`.

## Styling & tokens

- Tailwind entry + design tokens / CSS variables: `src/app/globals.css`.
- Design conventions: `STYLEGUIDE.md`. `cn()` helper: `src/lib/utils.ts` / `src/shared/utils/cn.ts`.

## Types & config

- Shared types: `src/core/types/index.ts`.
- Next config (static export): `next.config.ts`. shadcn config: `components.json`. TS paths: `tsconfig.json`.
