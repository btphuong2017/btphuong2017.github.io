## Portfolio UI Style Guide

This document captures the design system used across the portfolio so future changes stay consistent and easy to maintain.

### Typography

- **Hero title**: `text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground`
- **Section titles**: `text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground`
- **Card / block titles**: `text-base sm:text-lg font-semibold text-foreground`
- **Body text**: `text-sm sm:text-base text-muted-foreground leading-relaxed`
- **Meta / labels / chips**: `text-xs font-medium text-muted-foreground` (uppercase when needed)

Use `text-foreground` for primary headings, `text-muted-foreground` for supporting copy.

### Spacing

- **Sections**: `py-12 md:py-16 lg:py-20` (via `Section` component)
- **Stacks inside sections**:
  - Large blocks: `space-y-10`
  - Section headers: `space-y-3` or `space-y-4`
- **Grids**: `gap-4` (compact) or `gap-6` (cards and major grids)
- **Cards**:
  - Shadcn `Card`: use `CardHeader` / `CardContent` defaults, with minor adjustments like `pb-3`, `pt-4`
  - Plain containers: `p-6` for card-like panels

### Layout patterns

- **Section wrapper**: `Section`
  - Adds vertical padding and a light divider:  
    `py-12 md:py-16 lg:py-20 border-t border-border/60 first:border-t-0`
- **Width + gutters**: `Container`
  - `container mx-auto max-w-screen-2xl px-4`
- **Section headers**: `SectionHeader`
  - Props: `label?`, `icon?`, `title`, `description?`, `align? = "left" | "center"`
  - Renders:
    - Optional label pill: `rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground`
    - Title: section title scale
    - Description: body text scale

### Card pattern

- **Primary cards** (projects, experience):
  - `className="rounded-xl border border-border bg-card/80 shadow-none"`
  - Structure:
    - `CardHeader`: title + meta (e.g. role, dates)
    - `CardContent`: body copy and supporting details
- **Secondary cards** (skills groups, similar panels):
  - `<div className="rounded-xl border border-border bg-card/80 p-6">…</div>`

Inside cards:

- Titles use card title scale (`text-base sm:text-lg font-semibold text-foreground`).
- Descriptions use body text scale and `text-muted-foreground`.
- Meta information (dates, counts) uses `text-xs text-muted-foreground`.

### Interaction pattern

- **Links in nav / footer**:
  - Base: `text-muted-foreground`
  - Hover: `hover:text-foreground transition-colors`
- **Buttons** (shadcn):
  - Use default and `variant="outline"` with minimal overrides.
  - Avoid heavy shadows, glows, and scale animations.
- **In-page navigation**:
  - Sections expose IDs (`home`, `experience`, `projects`, `skills`).
  - Header/footer links and hero “View projects” scroll to these anchors.

### Motion & accessibility

- Global `prefers-reduced-motion: reduce` support in `globals.css`:
  - Drastically reduces animation and transition durations.
- Animations are limited to simple fade-ins; infinite and decorative animations are avoided by default.
- Use shadcn tokens:
  - Backgrounds: `bg-background`, `bg-card/80`
  - Text: `text-foreground`, `text-muted-foreground`
  - Borders: `border border-border`

### Responsive behavior

- **Breakpoints**:
  - `sm` (≥640px): increase font sizes; adjust grids (e.g. `sm:grid-cols-3` for simple stats).
  - `md` (≥768px): center some section headers; show header navigation; use 2-column grids.
  - `lg` (≥1024px): use 3-column grids for projects/skills where appropriate.

Patterns:

- Grids: `grid gap-6 md:grid-cols-2 lg:grid-cols-3` for card collections.
- Single-column on mobile; multi-column only at `md`/`lg` to preserve readability and touch targets.

### Usage guidelines

- When adding a new section:
  1. Wrap with `Section` and `Container`.
  2. Use `SectionHeader` for the heading block.
  3. Follow the card pattern for any repeated content blocks.
  4. Use the typography and spacing scales above instead of ad-hoc sizes.
- When adding a new card type:
  - Start from the existing card classes to keep borders, radius, and background consistent.

