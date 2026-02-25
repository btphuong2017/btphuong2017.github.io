export const site = {
  name: "Portfolio",
  title: "Your Name — Portfolio",
  description: "A modern portfolio built with Next.js, TypeScript, Tailwind CSS and shadcn/ui",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourname.github.io",
  defaultLocale: "vi",
  locales: ["en", "vi"] as const,
}

export type SiteConfig = typeof site

export default site
