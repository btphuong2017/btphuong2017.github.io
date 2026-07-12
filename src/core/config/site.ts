export const site = {
  name: "Portfolio",
  title: "Phuong Bui Thanh — Senior Frontend Developer (React/Next.js)",
  description:
    "Senior Frontend Developer with 8 years in JavaScript/TypeScript. Deep expertise in React/Next.js with SSR, bundle optimization, Micro Frontend (Nx), and CI/CD for containerized deployments. Led a frontend team of 8 in a 60-person program.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://btphuong2017.github.io",
  defaultLocale: "en",
  locales: ["en", "vi"] as const,
}

export type SiteConfig = typeof site

export default site
