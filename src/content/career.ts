/**
 * The single source for dates, lines, stations and employers. Locale-neutral: strings
 * live in src/messages. The map and the drawing draw from this data.
 *
 * Dates are month-resolution "YYYY-MM" strings. All arithmetic is plain month
 * subtraction, so Jul 2023 to Mar 2026 is 32 months, as the CV counts it.
 *
 * Erasable TypeScript only: `npm run check` runs this file directly in Node.
 */

export type Ym = `${number}-${string}`
export type Line = "inside" | "outside"

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://btphuong2017.github.io"

export const person = {
  name: "Bùi Thanh Phương",
  email: "btphuong2017@gmail.com",
  linkedin: "https://www.linkedin.com/in/phuong-bui-thanh-3035a0227/",
  phone: "+84 964 747 781",
  cv: "/CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf",
}

/* ---------- time axis ---------- */

/** The map's axis: start of 2017 up to the end of 2026 (`to` is exclusive). */
export const axis: { from: Ym; to: Ym } = { from: "2017-01", to: "2027-01" }

export function toMonths(ym: Ym): number {
  const [year, month] = ym.split("-").map(Number)
  return year * 12 + month - 1
}

export const monthsBetween = (from: Ym, to: Ym) => toMonths(to) - toMonths(from)

/** Where a date sits along the axis: 0 at `axis.from`, 1 at `axis.to`. Multiply by the map's length. */
export const axisPosition = (ym: Ym) =>
  monthsBetween(axis.from, ym) / monthsBetween(axis.from, axis.to)

/** The years on the axis, for ticks. Position of a tick: `axisPosition(`${year}-01`)`. */
export const axisYears = Array.from({ length: 10 }, (_, i) => 2017 + i)

/* ---------- lines ---------- */

/** Both lines run on these spans and break everywhere else. */
export const lineSpans: { from: Ym; to: Ym }[] = [
  { from: "2017-06", to: "2017-12" },
  { from: "2018-06", to: "2026-03" },
]

/* ---------- employer band and experience table ---------- */

export type RoleId = "intern" | "developer" | "senior" | "teamLeader" | "fpt"

export type Role = {
  id: RoleId
  employer: string
  from: Ym
  /** null: open-ended. The band runs to the end of the axis. */
  to: Ym | null
}

/**
 * Chronological; the experience table reverses it. A new role is one entry here plus
 * its strings in `experience.roles` and `map.band`. The map draws a band for each role,
 * and a line only where `lineSpans` says.
 */
export const roles: Role[] = [
  { id: "intern", employer: "AMIT Group", from: "2017-06", to: "2017-12" },
  { id: "developer", employer: "AMIT Group", from: "2018-06", to: "2021-12" },
  { id: "senior", employer: "AMIT Group", from: "2021-12", to: "2023-07" },
  { id: "teamLeader", employer: "Indo Trans Logistics", from: "2023-07", to: "2026-03" },
  // { id: "", employer: "", from: "2026-03", to: "2026-09" },
  { id: "fpt", employer: "FPT Software", from: "2026-09", to: null },
]

/* ---------- stations ---------- */

export type StationId = "kensa" | "sogus" | "medbuy" | "vela"
export type AudienceId =
  | "admin"
  | "customer"
  | "administrators"
  | "candidates"
  | "suppliers"
  | "agents"
  | "endUsers"
  | "corePortal"
  | "customerPortal"
  | "supplierPortal"

export type Station = {
  id: StationId
  name: string
  from: Ym
  to: Ym
  /** The case this station links to. */
  href: `#${string}`
  /** Who the product served, and which line each of them sits on. */
  audiences: { id: AudienceId; line: Line }[]
}

/** Chronological. Medbuy starts inside SOGUS and stops only on the outside line. */
export const stations: Station[] = [
  {
    id: "kensa",
    name: "Kensa",
    from: "2021-03",
    to: "2021-07",
    href: "#kensa",
    audiences: [
      { id: "admin", line: "inside" },
      { id: "customer", line: "outside" },
    ],
  },
  {
    id: "sogus",
    name: "SOGUS",
    from: "2022-11",
    to: "2023-07",
    href: "#sogus",
    audiences: [
      { id: "administrators", line: "inside" },
      { id: "candidates", line: "outside" },
    ],
  },
  {
    id: "medbuy",
    name: "Medbuy",
    from: "2022-12",
    to: "2023-07",
    href: "#medbuy",
    audiences: [
      { id: "suppliers", line: "outside" },
      { id: "agents", line: "outside" },
      { id: "endUsers", line: "outside" },
    ],
  },
  {
    id: "vela",
    name: "VELA",
    from: "2023-07",
    to: "2026-03",
    href: "#vela",
    audiences: [
      { id: "corePortal", line: "inside" },
      { id: "customerPortal", line: "outside" },
      { id: "supplierPortal", line: "outside" },
    ],
  },
]

/** An interchange is one product serving both lines. It gets the sun colour. */
export const isInterchange = (station: Station) =>
  new Set(station.audiences.map((audience) => audience.line)).size === 2

/* ---------- VELA, for the drawing ---------- */

export type VelaLayerId = "core" | "platforms" | "tenants" | "repos" | "rack"

/** The drawing's layers, in the order of the parts list. `line` is the colour; null is ink. */
export const velaLayers: { id: VelaLayerId; line: Line | null }[] = [
  { id: "core", line: "inside" },
  { id: "platforms", line: "outside" },
  { id: "tenants", line: null },
  { id: "repos", line: null },
  { id: "rack", line: null },
]

export type VelaRepoId = "core" | "customer" | "supplier" | "integration"

/** The 4 rails. `integration` connects to the generic external-systems block. */
export const velaRepos: { id: VelaRepoId; line: Line | null }[] = [
  { id: "core", line: "inside" },
  { id: "customer", line: "outside" },
  { id: "supplier", line: "outside" },
  { id: "integration", line: null },
]

/* ---------- skill lines ---------- */

/** The Skills section's columns. AMIT is the senior years (role "senior"), not a station. */
export type SkillProjectId = StationId | "amit"
export const skillProjects: SkillProjectId[] = ["kensa", "amit", "sogus", "medbuy", "vela"]

export type SkillGroupId = "frontend" | "performance" | "architecture" | "data" | "quality" | "devops" | "ui" | "backend" | "ai"

/**
 * Each CV skill group and the projects where the CV says it was used, in the CV's order.
 * Its line stops only there. Text for each stop: `skills.groups[id].stops` in messages.
 * AI-assisted development has no project in the CV, so no stops.
 */
export const skillLines: { id: SkillGroupId; stops: SkillProjectId[] }[] = [
  { id: "frontend", stops: ["kensa", "sogus", "medbuy", "vela"] },
  { id: "performance", stops: ["vela"] },
  { id: "architecture", stops: ["sogus", "medbuy", "vela"] },
  { id: "data", stops: ["medbuy"] },
  { id: "quality", stops: ["vela"] },
  { id: "devops", stops: ["kensa", "medbuy", "vela"] },
  { id: "ui", stops: ["vela"] },
  { id: "backend", stops: ["kensa", "amit"] },
  { id: "ai", stops: [] },
]

/* ---------- formatting ---------- */

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatYm(ym: Ym, locale: "vi" | "en"): string {
  const [year, month] = ym.split("-").map(Number)
  return locale === "vi" ? `${month}/${year}` : `${EN_MONTHS[month - 1]} ${year}`
}

/** "7/2023–3/2026" or "Jul 2023 – Mar 2026". `now` is the word for an open end. */
export function formatRange(from: Ym, to: Ym | null, locale: "vi" | "en", now = ""): string {
  const end = to ? formatYm(to, locale) : now
  return locale === "vi" ? `${formatYm(from, locale)}–${end}` : `${formatYm(from, locale)} – ${end}`
}
