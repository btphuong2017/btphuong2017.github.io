"use client"

import {
  createContext,
  useCallback,
  useContext,
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
