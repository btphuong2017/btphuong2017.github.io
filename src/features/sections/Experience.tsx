import { formatRange, roles } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import type { Messages } from "@/messages"
import styles from "./sections.module.css"

// Explicit roles: the phone layout changes the display of table parts, which
// otherwise drops their table semantics in some browsers.
export function Experience({ locale, m }: { locale: Locale; m: Messages["experience"] }) {
  return (
    <section id="experience" className="wrap section">
      <h2 className="reveal">{m.title}</h2>
      <table className={`reveal ${styles.table}`} role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">{m.columns.role}</th>
            <th role="columnheader" scope="col">{m.columns.org}</th>
            <th role="columnheader" scope="col">{m.columns.when}</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {roles.toReversed().map((role) => (
            <tr key={role.id} role="row">
              <th role="rowheader" scope="row">{m.roles[role.id]}</th>
              <td role="cell">
                {role.employer}
                {role.id === "fpt" && `, ${m.projects.fpt}`}
              </td>
              <td role="cell">{formatRange(role.from, role.to, locale, m.now)}</td>
            </tr>
          ))}
        </tbody>
        <tbody role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="colgroup" colSpan={3} className={styles.tableGroup}>
              {m.educationTitle}
            </th>
          </tr>
          <tr role="row">
            <th role="rowheader" scope="row">{m.education.degree}</th>
            <td role="cell">{m.education.school}</td>
            <td role="cell">{m.education.when}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
