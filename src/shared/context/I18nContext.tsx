"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"

type Messages = Record<string, unknown>

type I18nValue = {
  locale: string
  messages: Messages
}

const I18nContext = createContext<I18nValue | null>(null)

function getNested(obj: unknown, path: string): unknown {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string
  messages: Messages
  children: ReactNode
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages])
  // Keep <html lang> in sync with the active locale (static export renders a
  // single root <html lang="en">; correct it per route for screen readers).
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useTranslations(namespace: string) {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useTranslations must be used within I18nProvider")
  }
  const ns = getNested(ctx.messages, namespace) as Record<string, unknown> | undefined
  const t = useCallback(
    (key: string): string => {
      const v = ns ? getNested(ns, key) : undefined
      if (typeof v === "string") return v
      if (v != null && typeof v === "object" && !Array.isArray(v)) {
        return JSON.stringify(v)
      }
      return key
    },
    [ns]
  )
  return t
}

export function useLocale(): string {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useLocale must be used within I18nProvider")
  }
  return ctx.locale
}

/**
 * Returns the raw (array/object/string) value at `namespace` in the current
 * locale's messages — used for structured content (work rows, metric cells,
 * skill lines, platform-map cells). Returns undefined if the path is missing.
 */
export function useMessages<T = unknown>(namespace: string): T | undefined {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useMessages must be used within I18nProvider")
  }
  return getNested(ctx.messages, namespace) as T | undefined
}
