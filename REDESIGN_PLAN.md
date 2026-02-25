# Portfolio Redesign — Architecture-Level Plan (Step B)

## New information hierarchy

### 1. HERO
- **Positioning**: Frontend Architect & Team Lead (or equivalent), not just “Senior Developer”.
- **Value proposition**: 2 lines — e.g. “Architect of Micro Frontend systems. Lead of 8 frontend developers in a 60-person organization.”
- **CTAs**: Primary = Contact (mailto), Secondary = View projects (scroll), Tertiary = Download CV (link to `/CV - Phuong Bui Thanh.pdf` or public URL).
- **Visual**: Keep pill + name + summary + avatar; ensure stats (8+, 3+, 15+) are clearly “proof” labels.

### 2. IMPACT HIGHLIGHTS (new section)
- **Place**: Directly below Hero.
- **Content**: 4–5 metric cards.
  - Years experience (8+)
  - Team size led (8 developers)
  - Architecture (Micro Frontend / Nx)
  - Scale (Multi-tenant, 3 portals)
  - Domain (Enterprise logistics / products shipped)
- **Design**: Card-based, icon + number/label + short line; same border/card style as existing design system.
- **i18n**: New keys in `impact` namespace.

### 3. EXPERIENCE
- **Format**: Keep current layout (company, role, dates, summary, bullets).
- **Bullets**: Rewrite to **Action + Tech + Impact + Scale** (e.g. “Designed and implemented Micro Frontend with Nx → enabled independent deployment and parallel teams”).
- **Data**: Keep `experience.json`; optionally add a `impactLine` per job for one-liner impact (can be derived from first highlight if needed).

### 4. PROJECTS (case-study style)
- **Structure per card**:
  - Title + role + duration (as now).
  - **Problem** (1 line) — what challenge.
  - **Solution** (1–2 lines) — what we built.
  - **Tech stack** — tags (as now).
  - **Impact** (1 line) — scale, outcome.
  - **Link** — Code / Live if available; else “Case study” or omit.
- **Visual**: Optional screenshot placeholder (e.g. gradient or image slot); card remains content-first.
- **Data**: Add `problem`, `solution`, `impact` to `projects.json` (or use existing summary/highlights to derive copy in messages).

### 5. ABOUT (new section)
- **Place**: After Projects or before Skills.
- **Content**: Short (3–5 sentences), architecture- and leadership-focused: Nx, Micro Frontend, multi-tenant, CI/CD, team leadership, performance. Evidence-based (years, team size, domain).
- **i18n**: New `about` namespace.

### 6. SKILLS
- **Grouping**: Architecture | Frameworks | DevOps | Performance | Backend integration (or similar). Map existing `skills.json` categories to these groups.
- **Display**: Keep card-per-group; ensure category labels match new groups; optional short subtitle per group.

### 7. CONTACT (strong CTA)
- **Place**: Dedicated section before footer (or expand footer block).
- **Content**: Headline (“Let’s work together” / “Get in touch”), short line, primary button (Contact / Email), secondary (Download CV).
- **i18n**: New `contact` namespace.

---

## Component plan

| Component | Action |
|-----------|--------|
| **MetricCard / ImpactCard** | New. Icon, value, label, optional short description. Reusable for Impact Highlights. |
| **SectionHeader** | Keep; use for Impact, About, Contact. |
| **Card (shadcn)** | Keep; use for Impact cards, project case-study cards. |
| **ProjectCard** | Evolve: add problem/solution/impact slots; optional image placeholder; same tech tags + links. |
| **StickyBar** | New (optional). Minimal bar (e.g. “Contact” + “Download CV”) visible on scroll after hero. |
| **ContactCTA** | New. Section with headline, text, 1–2 buttons. |
| **AboutBlock** | New. Section + Container + prose-style text from i18n. |

## Layout changes

- **Page order**: Hero → Impact Highlights → Experience → Projects → About → Skills → Contact → Footer.
- **Container / Section** unchanged; add one Section per new block (Impact, About, Contact).
- **Max width** unchanged (Container); Impact cards in grid (2x2 or 4 in a row on large screens).
- **Footer** unchanged; ensure nav links include #about and #contact.

## Motion strategy

- **Reduced motion**: Keep `prefers-reduced-motion` in globals.css (already present).
- **Scroll reveal**: Add subtle `animate-fade-in-up` (or similar) to sections on scroll — e.g. `IntersectionObserver` + class, or CSS `@starting-style` / `animation-timeline: view()` if supported; fallback: no animation.
- **Hover**: Light border/opacity change on cards and buttons (already in design system); avoid heavy scale/glow.
- **Sticky CTA**: If implemented, simple slide-in or opacity transition when passing hero (optional).

## SEO & meta

- **Per-locale metadata**: In `[locale]/layout.tsx` or generateMetadata: `title`, `description`, `openGraph` using site name and locale-specific description.
- **Root layout**: Keep generic metadata; locale-specific in child layout.

## Data & i18n changes

- **profile.json**: Optionally add `titleAlternate: "Frontend Architect & Team Lead"`; or drive from messages.
- **projects.json**: Add `problem`, `solution`, `impact` (or reuse summary/highlights and push copy to messages).
- **messages (en.json / vi.json)**: Add namespaces: `impact`, `about`, `contact`; extend `hero` (value prop, download CV); extend `projects` if we move problem/solution/impact to messages.

---

*Next: Step C (implementation), Step D (content), Step E (quality gate).*
