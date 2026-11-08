import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { baseMetadata } from "@/content/metadata"
import { isLocale, routing } from "@/i18n/routing"
import { saveLocaleScript } from "@/lib/locale-redirect"
import { Document } from "../Document"

export const metadata = baseMetadata
export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <Document lang={locale}>
      <script dangerouslySetInnerHTML={{ __html: saveLocaleScript(locale) }} />
      {children}
    </Document>
  )
}
