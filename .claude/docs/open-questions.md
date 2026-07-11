# Open Questions

Unresolved items noticed during `/project-init` (2026-07-11). None block work; confirm when convenient.

- **Stray `portfolio/` subdirectory.** An empty `portfolio/` folder sits at the repo root
  (the app lives in `src/`). Likely leftover scaffolding — safe to delete? Left untouched for now.
- **Two CV PDFs in `public/`.** Both `CV - Phuong Bui Thanh.pdf` and
  `CV-Bui-Thanh-Phuong-Senior-ReactJS-Developer.pdf` exist. Which is canonical / referenced by the
  download link? The other could be removed.
- **Untracked `docs/design/`.** `docs/design/SPEC-portfolio-redesign.md` and
  `Portfolio-Redesign-Prototype.html` are present but not committed. Intentional (scratch), or should they be tracked?
- **Redesign docs status.** `REDESIGN_AUDIT.md` / `REDESIGN_PLAN.md` at the root — active work or
  historical? Determines whether they belong in `docs/`.
- **Testing.** No test framework is configured. Add one (e.g. for data-shape validation), or keep
  verification to `lint` + `build` + manual locale/theme checks?
