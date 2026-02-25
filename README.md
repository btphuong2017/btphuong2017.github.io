# Portfolio

Personal portfolio site built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **shadcn/ui**. Single-page layout with Hero, Experience, Projects, and Skills sections, responsive design, and dark/light theme support.

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Lucide icons
- **i18n:** next-intl (locales: `en`, `vi`)
- **Theming:** next-themes
- **Language:** TypeScript 5

## Prerequisites

- Node.js 20+
- npm (or pnpm / yarn)

## Getting started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to the default locale (`/vi`).

### Other scripts

| Script   | Description        |
|----------|--------------------|
| `npm run build` | Production build   |
| `npm run start` | Run production server |
| `npm run lint`  | Run ESLint         |

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Locale-specific layout & home page
│   ├── layout.tsx         # Root layout (fonts, ThemeProvider)
│   └── globals.css        # Tailwind + design tokens
├── features/home/         # Home page sections
│   ├── HeroSection.tsx
│   ├── ExperienceSection.tsx
│   ├── ProjectsSection.tsx
│   └── SkillsSection.tsx
├── shared/
│   ├── components/        # Reusable UI (Section, Container, SectionHeader, ContentCard, Tag, AppHeader, AppFooter)
│   └── utils/             # cn() etc.
├── data/                  # Static content (JSON)
│   ├── profile.json
│   ├── experience.json
│   ├── projects.json
│   └── skills.json
├── messages/               # i18n strings (en.json, vi.json)
└── components/ui/          # shadcn/ui components
```

## Customization

- **Profile, experience, projects, skills:** Edit the JSON files in `src/data/`. Experience and projects use `summary` + `highlights` arrays for section text and bullet lists.
- **Avatar:** Place your photo at `public/avatar.jpg`; the Hero section uses it automatically.
- **Locales:** Default locale and supported locales are set in `src/app/[locale]/layout.tsx` and `src/app/page.tsx` (redirect). Message files live in `src/messages/`.
- **Design system:** See [STYLEGUIDE.md](./STYLEGUIDE.md) for typography, spacing, cards, and layout patterns.

## License

Private project.
