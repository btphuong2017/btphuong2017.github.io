export type NavItem = {
  title: string
  href: string
}

export type Experience = {
  company: string
  role: string
  start: string // ISO date or year
  end?: string // ISO date, year or 'Present'
  description?: string
}

export type Project = {
  title: string
  slug: string
  description?: string
  tech?: string[]
  url?: string
  repo?: string
}

export type Locale = "en" | "vi"
