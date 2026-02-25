import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { routing } from "@/i18n/routing"
import { I18nProvider } from "@/shared/context/I18nContext"
import { AppHeader } from "@/shared/components/AppHeader"
import { AppFooter } from "@/shared/components/AppFooter"
import { site } from "@/core/config/site"

const titles: Record<string, string> = {
  en: "Phuong Bui Thanh — Frontend Architect & Team Lead",
  vi: "Phuong Bui Thanh — Kiến trúc sư Frontend & Trưởng nhóm",
}
const descriptions: Record<string, string> = {
  en: "Architect of Micro Frontend systems. 8+ years building high-performance web applications with Angular and React/Next.js. Led 8 frontend developers in a 60-person organization.",
  vi: "Thiết kế hệ thống Micro Frontend. Hơn 8 năm xây dựng ứng dụng web hiệu năng cao với Angular và React/Next.js. Dẫn dắt 8 lập trình viên frontend trong tổ chức 60 người.",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `${site.url}/${locale}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
  }
}

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

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const messages = (
    await import(`@/messages/${locale}.json`)
  ).default as Record<string, unknown>

  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </I18nProvider>
  )
}
