# Rules & Conventions

## Content vs. code

- **Change content via `src/data/*.json`, not JSX.** Section components render from these
  files; do not inline copy, project entries, or skills into components.
- Experience and project entries use `summary` + `highlights` arrays (see `CUSTOMIZE.md`).

## Localization

- Every user-facing UI string goes in `src/messages/en.json` **and** `src/messages/vi.json`
  with the same key. Never leave a key in only one locale.
- Default locale is `vi`; `en` and `vi` are the only supported locales. If a locale set
  changes, update `src/core/config/site.ts` and `src/i18n/routing.ts` together.

## Styling

- Use Tailwind utilities + shadcn tokens: `bg-background`, `bg-card/80`, `text-foreground`,
  `text-muted-foreground`, `border-border`. Follow the typography/spacing/card scales in `STYLEGUIDE.md`.
- Compose conditional classes with `cn()`. Reuse `Section`, `Container`, `SectionHeader`, and the
  card patterns rather than re-deriving classes.
- Avoid heavy shadows, glows, and decorative/infinite animations. Respect
  `prefers-reduced-motion` (already handled in `globals.css`).

## TypeScript & imports

- TypeScript throughout; put shared types in `src/core/types/`.
- Use the `@/*` path alias for imports (configured in `tsconfig.json` / `components.json`).

## Static-export constraints (`output: "export"`)

- No server components that fetch at request time, no route handlers, no server actions —
  everything must be resolvable at build time.
- Images are **not** optimized by Next.js; treat `next/image` as unoptimized and size assets accordingly.

## Process

- Match existing code style and structure; prefer editing existing files over adding new ones.
- Verify with `npm run lint` and `npm run build` before considering a change done.
- Do not commit, push, or deploy unless explicitly asked.
