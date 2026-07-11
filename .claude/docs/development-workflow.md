# Development Workflow

## Prerequisites

- Node.js 20+
- npm (lockfile is `package-lock.json`)

## Everyday loop

```bash
npm install        # first time / after dependency changes
npm run dev        # http://localhost:3000  (root redirects to /vi; also /en)
```

Edit content in `src/data/*.json` or UI strings in `src/messages/{en,vi}.json`; the dev
server hot-reloads. For component/style changes, follow `STYLEGUIDE.md`.

## Verify a change

1. `npm run lint` — must pass (ESLint / `eslint-config-next`).
2. `npm run build` — must succeed; this is a **static export**, so build-time errors
   (e.g. accidental server-only code) surface here.
3. Check both locales in the browser: `/vi` and `/en`.
4. Toggle dark/light theme and check mobile width — the layout is mobile-first.

## Build & deploy

```bash
npm run build      # emits static site to out/
```

Deployment is automated: pushing to the default branch triggers
`.github/workflows/nextjs.yml`, which builds and publishes to GitHub Pages.
Do not deploy manually or commit unless the user asks.

## Notes

- `out/`, `.next/`, and `node_modules/` are gitignored build/dependency artifacts — never edit by hand.
- `next-env.d.ts` is generated and gitignored.
