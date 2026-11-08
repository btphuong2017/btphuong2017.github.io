export const routing = {
  locales: ["en", "vi"],
  defaultLocale: "en",
} as const

export type Locale = (typeof routing.locales)[number]

export const isLocale = (value: string): value is Locale =>
  (routing.locales as readonly string[]).includes(value)
