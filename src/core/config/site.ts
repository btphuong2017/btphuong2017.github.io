export const site = {
  name: "Portfolio",
  title: "Phuong Bui Thanh — Senior Frontend Engineer & Team Lead",
  description:
    "Senior Frontend Engineer & Team Lead. Eight years building enterprise web platforms with React/Next.js and Angular — frontend architecture, performance, and the team that ships it.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://btphuong2017.github.io",
  defaultLocale: "en",
  locales: ["en", "vi"] as const,
}

export type SiteConfig = typeof site

export default site
