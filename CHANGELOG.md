# Changelog — Architecture-level portfolio redesign

## What changed

### Structure & content
- **Hero**: Positioning updated to "Frontend Architect & Team Lead" with a 2-line value proposition (Micro Frontend, 8 developers, 60-person org, Nx, multi-tenant, CI/CD). Added **Download CV** button next to Contact and View projects.
- **Impact Highlights** (new section): Five metric cards — 8+ years, 8 developers led, Nx Micro Frontend, 3 portals, 15+ products shipped — with short descriptions. Placed directly below Hero.
- **Experience**: Unchanged layout; content already follows Action + Tech + Impact. Profile title in `profile.json` set to "Frontend Architect & Team Lead".
- **Projects**: Converted to **case-study cards** with Problem / Solution / Impact per project. Project-specific copy added in `messages` (en + vi) for VELA, SOGUS, Medbuy, Kensa, Kilu. Tech tags and links unchanged.
- **About** (new section): Short, architecture- and leadership-focused narrative (Nx, Micro Frontend, CI/CD, 8 devs, 60-person program, reusable components, performance). Bilingual in messages.
- **Skills**: Regrouped into five categories — **Architecture**, **Frameworks**, **DevOps**, **Performance**, **Backend integration** — with labels from i18n. `skills.json` restructured by `group` and `items`.
- **Contact** (new section): Strong CTA block with headline, short description, **Get in touch** (mailto) and **Download CV** buttons. Section id `#contact` for nav.

### Navigation & layout
- **Page order**: Hero → Impact → Experience → Projects → About → Skills → Contact → Footer.
- **Header & footer**: Nav links updated to include Impact, About, and Contact (with anchors #impact, #about, #contact).
- **SEO**: Per-locale metadata in `[locale]/layout.tsx`: `generateMetadata` sets `title`, `description`, and `openGraph` (url, siteName, locale) for en and vi.

### Components & design
- **MetricCard**: New reusable card (icon, value, label, optional description) for Impact section. Uses existing border/card style.
- **ImpactHighlightsSection**, **AboutSection**, **ContactSection**: New feature sections; use `Section`, `Container`, `SectionHeader` and existing design tokens.
- **ProjectsSection**: Renders case-study block (Problem / Solution / Impact) when messages contain project slug keys (e.g. `projects.vela.problem`); otherwise falls back to summary + highlights.
- **STYLEGUIDE.md**: Unchanged; new components follow existing typography and spacing.

### Data & i18n
- **messages (en.json / vi.json)**: New namespaces — `impact`, `about`, `contact`; `hero` extended with `downloadCv` and updated pill/summary; `nav` and `footer` extended with impact, about, contact; `projects` extended with `problem`, `solution`, `impact` labels and per-project case copy (`vela`, `sogus`, `medbuy`, `kensa`, `kilu`); `skills.groups` for the five group labels.
- **profile.json**: `title` set to "Frontend Architect & Team Lead".
- **skills.json**: Replaced category list with five groups (`architecture`, `frameworks`, `devops`, `performance`, `backend`) and flat `items` per group.

### Docs
- **REDESIGN_AUDIT.md**: Repository audit (structure, framework, styling, i18n, UX/UI/content issues).
- **REDESIGN_PLAN.md**: Redesign plan (information hierarchy, components, layout, motion, SEO, data/i18n).

---

## Why better

- **Positioning**: Clearly presents you as a Frontend Architect & Team Lead with evidence (Micro Frontend, Nx, 8 devs, 60-person org, multi-tenant, CI/CD).
- **Scanability**: Impact section gives recruiters quick, concrete metrics; case-study projects show problem/solution/impact instead of a flat list.
- **Differentiation**: About section and hero copy are architecture- and leadership-focused, with measurable scale.
- **Conversion**: Contact section and Download CV in Hero and Contact make next steps obvious; nav supports the new structure.
- **SEO**: Locale-specific titles and descriptions improve relevance for en/vi and social sharing.
- **Consistency**: Same tech stack, routing, and i18n; static export and GitHub Pages compatibility preserved.

---

## Future ideas

- **Sticky CTA**: A slim bar (e.g. Contact + Download CV) that appears after scrolling past the hero.
- **Scroll animations**: Use existing `animate-fade-in-up` (or view-timeline) on sections when they enter the viewport; keep `prefers-reduced-motion` support.
- **Project screenshots**: Add optional image or placeholder per project in `projects.json` and render in project cards.
- **CV in public**: Ensure `CV - Phuong Bui Thanh.pdf` is copied to `public/` (or deployed root) so the Download CV link works on GitHub Pages.
- **Profile links**: Replace placeholder `https://github.com` and `https://linkedin.com` in footer with real profile URLs from `profile.json` if desired.

---

## Tradeoffs

- **Skills**: Merged and regrouped into 5 groups; some overlap (e.g. Lazy Loading in both Architecture and Performance) was simplified into a single list per group. Revert to more categories in `skills.json` if you prefer finer labels.
- **Projects**: Case-study copy lives in messages (en/vi); project list and slugs stay in `projects.json`. Adding a new project requires adding slug + keys in both message files.
- **Motion**: No new scroll-triggered animation was added to keep dependencies and JS minimal; keyframes remain in `globals.css` for future use.
- **CV link**: Points to `/CV - Phuong Bui Thanh.pdf`; copy `CV - Phuong Bui Thanh.pdf` from repo root into `public/` so the Download CV link works on static deploy (e.g. GitHub Pages).
