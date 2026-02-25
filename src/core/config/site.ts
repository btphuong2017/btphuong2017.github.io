export const site = {
  name: "Portfolio",
  title: "Phuong Bui Thanh — Portfolio",
  description:
    "Frontend Architect & Team Lead – Micro Frontend (Nx), multi-tenant logistics, Angular & React/Next.js.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://btphuong2017.github.io",
  defaultLocale: "vi",
  locales: ["en", "vi"] as const,
}

export type SiteConfig = typeof site

export default site
