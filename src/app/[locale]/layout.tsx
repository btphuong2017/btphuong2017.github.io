import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { routing } from "@/i18n/routing"
import { I18nProvider } from "@/shared/context/I18nContext"
import { AppHeader } from "@/shared/components/AppHeader"
import { AppFooter } from "@/shared/components/AppFooter"
import { site } from "@/core/config/site"

const titles: Record<string, string> = {
  en: "Phuong Bui Thanh — Senior Frontend Engineer & Team Lead",
  vi: "Phuong Bui Thanh — Senior Frontend Engineer & Team Lead",
}
const descriptions: Record<string, string> = {
  en: "Senior Frontend Engineer & Team Lead. Eight years building enterprise web platforms with React/Next.js and Angular — I design frontend architecture, keep it fast, and lead the team that ships it.",
  vi: "Senior Frontend Engineer & Team Lead. 8 năm xây dựng các nền tảng web doanh nghiệp với React/Next.js và Angular — thiết kế kiến trúc frontend, giữ cho nó nhanh, và dẫn dắt đội ngũ đưa nó ra sản phẩm.",
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
  const ogImage = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: title,
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
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
