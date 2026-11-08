import { Fragment, type ReactNode } from "react"
import { CareerMap } from "@/features/map/CareerMap"
import { Drawing } from "@/features/drawing/Drawing"
import { person } from "@/content/career"
import { routing, type Locale } from "@/i18n/routing"
import { messages, type Messages } from "@/messages"
import { Contact } from "./Contact"
import { Experience } from "./Experience"
import { Hero } from "./Hero"
import type { SectionId } from "./order"
import { Sheets } from "./Sheets"
import { Skills } from "./Skills"
import styles from "./sections.module.css"

/** Section ids that get a nav link, with the anchor each one lands on. */
const navAnchors: Partial<Record<SectionId, string>> = {
  drawing: "#vela",
  sheets: "#sheets",
  experience: "#experience",
  contact: "#contact",
}

function sectionFor(id: SectionId, locale: Locale, m: Messages): ReactNode {
  switch (id) {
    case "map":
      return (
        <Hero m={m.hero}>
          <CareerMap locale={locale} m={m.map} />
        </Hero>
      )
    case "drawing":
      return <Drawing locale={locale} m={m.drawing} />
    case "sheets":
      return <Sheets locale={locale} m={m.sheets} />
    case "experience":
      return <Experience locale={locale} m={m.experience} />
    case "skills":
      return <Skills m={m.skills} />
    case "contact":
      return <Contact m={m.contact} />
  }
}

/** `path`: what follows the locale in this page's URL, so the EN/VI links stay on it. */
export function Page({ locale, order, path }: { locale: Locale; order: SectionId[]; path: string }) {
  const m = messages[locale]
  const links = order.flatMap((id) => {
    const href = navAnchors[id]
    return href ? [{ href, label: m.nav.links[id as keyof typeof m.nav.links] }] : []
  })
  return (
    <>
      <a className={styles.skip} href="#main">
        {m.nav.skip}
      </a>
      <header className={`wrap ${styles.nav}`}>
        <a className={styles.mark} href={`/${locale}/`}>
          {person.name}
        </a>
        <div className={styles.tools}>
          <span className={styles.locales} role="group" aria-label={m.nav.locale}>
            {routing.locales.map((l) => (
              <a key={l} href={`/${l}/${path}`} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                {l.toUpperCase()}
              </a>
            ))}
          </span>
          <a href={person.cv} aria-label={m.nav.cvLabel}>
            {m.nav.cv}
          </a>
        </div>
        <nav className={styles.links} aria-label={m.nav.label}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        {order.map((id) => (
          <Fragment key={id}>{sectionFor(id, locale, m)}</Fragment>
        ))}
      </main>
      <footer className={`wrap ${styles.footer}`}>
        <p>{m.footer.copyright}</p>
        <p>{m.footer.type}</p>
      </footer>
    </>
  )
}
