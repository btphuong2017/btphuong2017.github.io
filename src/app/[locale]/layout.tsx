import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import en from "../../messages/en.json"
import vi from "../../messages/vi.json"
import { AppHeader } from "@/shared/components/AppHeader"
import { AppFooter } from "@/shared/components/AppFooter"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (locale !== "en" && locale !== "vi") {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
