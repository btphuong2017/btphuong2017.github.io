export type SectionId = "map" | "drawing" | "sheets" | "experience" | "skills" | "contact"

/** The page, top to bottom. "map" holds slot src/features/map; "drawing" holds slot src/features/drawing. */
export const defaultOrder: SectionId[] = ["map", "drawing", "sheets", "experience", "skills", "contact"]

export const readers = ["recruiter", "engineer", "lead"] as const
export type Reader = (typeof readers)[number]

export const isReader = (value: string): value is Reader =>
  (readers as readonly string[]).includes(value)

/** /[locale]/for/[reader]: the same sections in another order. */
export const readerOrder: Record<Reader, SectionId[]> = {
  recruiter: ["map", "experience", "skills", "drawing", "sheets", "contact"],
  engineer: ["map", "drawing", "sheets", "skills", "experience", "contact"],
  lead: ["map", "experience", "drawing", "sheets", "skills", "contact"],
}
