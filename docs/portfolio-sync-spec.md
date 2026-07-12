# Portfolio Sync Spec — Align btphuong2017.github.io with Master CV

**Goal:** Update the portfolio (EN page `/en`, VI page `/vi`) so every fact, date, metric and keyword matches the master CV `CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf` (React/Next.js variant, finalized 2026-07). The CV is the single source of truth. Do NOT invent any achievement, date, or technology not listed in this spec.

**Scope:** Content changes only. Do not redesign layout, components, or styling. Apply every change to BOTH the EN and VI pages (translate naturally for VI; keep proper nouns, tech terms and metrics identical).

---

## 1. Positioning / titles / meta (Priority: HIGH)

Replace the "Frontend Architect & Team Lead" positioning with the CV positioning.

- Page `<title>` and `og:title` / `twitter:title`:
  - New: `Phuong Bui Thanh — Senior Frontend Developer (React/Next.js)`
- `meta description`, `og:description`, `twitter:description`:
  - New: `Senior Frontend Developer with 8 years in JavaScript/TypeScript. Deep expertise in React/Next.js with SSR, bundle optimization, Micro Frontend (Nx), and CI/CD for containerized deployments. Led a frontend team of 8 in a 60-person program.`
- Hero eyebrow/subtitle (currently `Frontend Architect & Team Lead`):
  - New: `Senior Frontend Developer · React / Next.js`
- Hero intro paragraph — replace with:
  > `Senior Frontend Developer with 8 years of experience in JavaScript/TypeScript, building, testing and operating high-performance web applications at enterprise scale. Deep expertise in React/Next.js with Server-Side Rendering (SSR), bundle optimization, Micro Frontend architecture (Nx Monorepo), and CI/CD for containerized deployments (Docker, Kubernetes). Strong TypeScript foundation across both the React/Next.js and Angular ecosystems — and a hands-on team leader who led a frontend team of 8 in a 60-person logistics program.`
- Footer role line (`Frontend Architect & Team Lead` under the name): change to `Senior Frontend Developer · React / Next.js`.
- Contact section text `Open to Frontend Architect and Team Lead opportunities...`:
  - New: `Open to Senior Frontend (React/Next.js) and Frontend Lead opportunities, especially where scale, performance, and product ownership matter.`

## 2. Experience section — dates and company names (Priority: HIGH — factual conflicts)

Replace the current experience entries with exactly these four entries, in this order. Dates MUST match the CV.

### Entry 1
- Company: `Indo Trans Logistics` (parent company — higher brand recognition). Sub-line/context: `VELA Logistics Platform`
- Role: `Frontend Team Leader (hands-on)`
- Dates: `Jul 2023 – Mar 2026` (NOT "Present" — the engagement has ended)
- Context line: `Multi-tenant logistics platform with 3 portals: Core Portal (internal operations), Customer Portal and Supplier Portal (both multi-tenant). Project team of 60; led the frontend team of 8.`
- Bullets (replace all current bullets):
  1. `Architected the Angular frontend for all 3 portals in TypeScript — a single-application Core Portal and an Nx-based Micro Frontend platform (1 Host + multiple Remotes) for the multi-tenant Customer and Supplier Portals, enabling independent deployment and parallel team development.`
  2. `Reduced the Core Portal's initial bundle size from 12 MB to 3 MB through bundle analysis, dependency import optimization, code splitting and route-based lazy loading — significantly improving initial load and rendering performance.`
  3. `Designed the multi-tenant Angular frontend for the Customer/Supplier Portals, with tenant-based configuration and isolation for 3 tenants.`
  4. `Implemented CI/CD pipelines to build Dockerized frontend applications and deploy them to Kubernetes across 4 frontend repositories, with automated unit tests (Jasmine) and SonarQube quality gates as release gates.`
  5. `Refactored and modernized legacy UI modules (component-level change-detection optimization, Bootstrap-to-Tailwind CSS migration) while keeping production releases stable.`
  6. `Led a team of 8 frontend developers: code review workflow, coding standards and a GitFlow-based branching strategy.`

### Entry 2
- Company: `AMIT Group Joint Stock Company`
- Role: `Senior Frontend Developer`
- Dates: `Dec 2021 – Jul 2023` (portfolio currently shows 2019-01 — this is WRONG, fix it)
- Bullets:
  1. `Developed and delivered multiple enterprise and client-facing web applications with React/Next.js in TypeScript, using Server-Side Rendering for SEO-critical and data-heavy views (see Projects: SOGUS, Medbuy).`
  2. `Built and integrated REST APIs with Node.js (NestJS) and Laravel to support frontend features.`
  3. `Led small frontend teams (3–5 developers): task planning, code review and technical mentoring.`
  4. `Deployed and maintained production applications on Linux servers; participated in containerized deployment with Docker.`
  5. `Contributed to project estimation and technical scoping, working directly with customers on requirements.`

### Entry 3 (NEW — currently missing on portfolio)
- Company: `AMIT Group Joint Stock Company`
- Role: `Frontend Developer`
- Dates: `Jun 2018 – Dec 2021`
- Bullets:
  1. `Built responsive web applications with React, Angular and WordPress for enterprise clients.`
  2. `Developed fullstack features with PHP/Laravel and MySQL (see Projects: Kensa Order System).`

### Entry 4
- Company: `AMIT Group`
- Role: `Frontend Internship`
- Dates: `Jun 2017 – Dec 2017` (portfolio currently shows 2018-09 – 2018-12 — this is WRONG, fix it; returned full-time in Jun 2018 after graduation)
- Keep existing internship bullets (PSD-to-HTML/CSS, AJAX, supporting senior developers) unchanged.

## 3. Impact / metrics section (Priority: MEDIUM)

- Add one metric card: value `12 MB → 3 MB`, label `Initial bundle size reduction`, sub-label `Core Portal — bundle analysis, code splitting, lazy loading`.
- Keep existing cards (8+ years, 8 developers led, Nx Micro Frontend, 3 portals, 15+ products). Update any card referencing "VELA Logistics" as a company to reference `Indo Trans Logistics (VELA platform)`.

## 4. Case studies (Priority: MEDIUM)

### VELA case study
- Header/company: change `VELA-LOGISTICS` / company naming to `Indo Trans Logistics — VELA Logistics Platform`.
- Dates: `2023-07 – 2026-03` (remove "Present").
- In "Decision" or "Outcome", add the bundle metric: `Reduced Core Portal initial bundle from 12 MB to 3 MB via bundle analysis, code splitting and route-based lazy loading.`
- Add `SonarQube` and `Jasmine` to the Tech tag list. Keep existing tags (Angular, Nx Monorepo, Micro Frontend, Docker, Kubernetes, .NET).

### SOGUS case study
- In "Solution", mention SSR explicitly. New solution text:
  > `Led frontend design across two applications — React/Next.js (Pages Router) with Server-Side Rendering (SSR) for the candidate-facing landing, interview and testing flows (SEO-critical pages, fast first render), and Angular for the internal administration portal.`
- Add `SSR` (or `Next.js (SSR)`) to the Tech tag list; add `TypeScript` if missing.

### Medbuy case study
- In "Solution", mention SSR explicitly. New solution text:
  > `Developed responsive, design-accurate UIs in React/Next.js, applying SSR for product and listing pages; integrated REST APIs with the NestJS backend; containerized deployment with Docker.`
- Add `SSR` and `TypeScript` to the Tech tag list.

### Kensa, Kilu case studies
- No content changes.

## 5. About section (Priority: MEDIUM)

Rewrite to match CV positioning while keeping the architecture/leadership substance. New text:
> `My focus is simple: high-performance frontend, scalable architecture, and reliable delivery. I work deeply in React/Next.js with Server-Side Rendering and in Angular at enterprise scale. At Indo Trans Logistics (VELA platform), I architected the frontend for 3 portals with an Nx-based Micro Frontend, cut the Core Portal's initial bundle from 12 MB to 3 MB, built Docker/Kubernetes CI/CD with Jasmine and SonarQube quality gates, and led a team of 8 frontend developers in a 60-person program. I care about testing, debugging and code-quality discipline across the full release lifecycle.`

## 6. Skills section (Priority: MEDIUM)

Add the following (do not remove existing skills):
- **Frameworks** group: add `React Testing Library`, `Redux Toolkit`, `TanStack Query`, `Zustand`, `Material UI`.
- **Architecture** group: add `SSR/CSR/SSG rendering strategies`.
- **Performance** group: add `Lighthouse`, `PageSpeed Insights`, `Integration Testing`.
- **DevOps** group: add `SonarQube`.
- Optionally add a new group `Testing & Quality`: `Jest, React Testing Library, Cypress, Jasmine, integration & E2E testing, SonarQube, debugging & troubleshooting` — if adding this group, move testing items out of "Performance" to avoid duplication.
- Add an `AI-assisted Dev` group: `Claude Code, Cursor — coding, debugging, refactoring, test generation` (matches CV).

## 7. CV download link (Priority: HIGH)

- Replace the hosted file `CV - Phuong Bui Thanh.pdf` with the new master CV, renamed to `CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf` (no spaces in filename).
- Update ALL "Download CV" links (hero + contact section + any footer link) on both EN and VI pages to point to the new filename.
- Delete or redirect the old file so no stale copy with outdated content remains reachable.

## 8. VI page (`/vi`)

Apply every change above to the Vietnamese page. Translate prose naturally into Vietnamese; keep all proper nouns (Indo Trans Logistics, VELA, SOGUS, Medbuy, Kensa), technology names, dates and metrics identical to the EN page. Do not machine-translate bullet-by-bullet if existing VI copy style differs — match the existing VI tone.

## Acceptance criteria

1. No occurrence of "Present" for the Indo Trans Logistics / VELA engagement; end date reads Mar 2026 (or 2026-03).
2. AMIT dates read exactly: Senior `Dec 2021 – Jul 2023`; Frontend Developer `Jun 2018 – Dec 2021`; Internship `Jun 2017 – Dec 2017`.
3. The string `12 MB` appears at least twice (Impact card + VELA experience/case study).
4. The string `SSR` or `Server-Side Rendering` appears in: hero intro, AMIT Senior bullets, SOGUS case study, Medbuy case study, and Skills.
5. "VELA Digitalized Logistics" no longer appears as a company name anywhere; company is `Indo Trans Logistics` with VELA described as the platform.
6. "Frontend Architect & Team Lead" no longer appears in title, meta, hero, footer, or contact CTA.
7. All Download CV links resolve to `CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf` and the file exists.
8. EN and VI pages carry identical facts, dates and metrics.
9. Build passes; no layout/visual regressions (content-only diff).

## Out of scope

- Visual redesign, new sections, blog, analytics changes.
- Any claim not present in this spec or the master CV (no fabricated metrics, no new technologies).
