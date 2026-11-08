import type { Locale } from "@/i18n/routing"
import en from "./en.json"
import vi from "./vi.json"

export type Messages = typeof vi

// Typed by vi.json, so a key missing from en.json fails the build.
export const messages: Record<Locale, Messages> = { vi, en }
