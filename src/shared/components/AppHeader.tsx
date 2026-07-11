"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "@/shared/context/I18nContext"

const NAV_LINKS = [
  { href: "#work", key: "work" },
  { href: "#experience", key: "experience" },
  { href: "#skills", key: "skills" },
  { href: "#contact", key: "contact" },
] as const

function pushGtmEvent(eventName: string, payload: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event: eventName, ...payload })
  } catch {
    // Never break UX
  }
}

export function AppHeader() {
  const t = useTranslations("nav")
  const pathname = usePathname() || "/en"

  const currentLocale = pathname.startsWith("/vi") ? "vi" : "en"
  const basePath = pathname.replace(/^\/(en|vi)/, "") || ""

  const mark = t("mark") // "btphuong.dev" — used as the logo's accessible name

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <a className="mark" href={`/${currentLocale}`} aria-label={mark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mark-logo" src="/logo-btp-wordmark.svg" alt={mark} />
        </a>

        <div className="nav-right">
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() =>
                  pushGtmEvent("portfolio_nav_click", { toSection: link.key })
                }
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="locale-switch" aria-label={t("localeSwitch")}>
            {(["en", "vi"] as const).map((loc) => (
              <a
                key={loc}
                href={`/${loc}${basePath}`}
                aria-current={loc === currentLocale ? "true" : undefined}
              >
                {loc.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AppHeader
