import type { Metadata } from "next"
import { person, siteUrl } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import { messages } from "@/messages"

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: person.name,
  // Icons are static files in public/ declared as plain <link> tags. (The src/app
  // icon.* file conventions trip a Turbopack build panic in Next 16.1.6.)
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
}

/** Reader routes share the home canonical, so they never compete with it in search. */
export function pageMetadata(locale: Locale, { noindex = false } = {}): Metadata {
  const { title, description } = messages[locale].meta
  const canonical = `/${locale}/`
  const ogImage = locale === "vi" ? "/og-image.png" : "/og-image-en.png"
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { vi: "/vi/", en: "/en/", "x-default": "/en/" },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: title,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  }
}
