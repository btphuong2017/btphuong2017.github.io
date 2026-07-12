import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { routing } from "@/i18n/routing"
import { I18nProvider } from "@/shared/context/I18nContext"
import { AppHeader } from "@/shared/components/AppHeader"
import { AppFooter } from "@/shared/components/AppFooter"
import { site } from "@/core/config/site"

const titles: Record<string, string> = {
  en: "Phuong Bui Thanh — Senior Frontend Developer (React/Next.js)",
  vi: "Phuong Bui Thanh — Senior Frontend Developer (React/Next.js)",
}
const descriptions: Record<string, string> = {
  en: "Senior Frontend Developer with 8 years in JavaScript/TypeScript. Deep expertise in React/Next.js with SSR, bundle optimization, Micro Frontend (Nx), and CI/CD for containerized deployments. Led a frontend team of 8 in a 60-person program.",
  vi: "Senior Frontend Developer với 8 năm kinh nghiệm JavaScript/TypeScript. Chuyên sâu React/Next.js với SSR, tối ưu bundle, Micro Frontend (Nx), và CI/CD cho triển khai container hóa. Đã dẫn dắt một team frontend 8 người trong chương trình 60 người.",
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
