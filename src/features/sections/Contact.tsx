import { person } from "@/content/career"
import type { Messages } from "@/messages"
import styles from "./sections.module.css"

export function Contact({ m }: { m: Messages["contact"] }) {
  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className={`wrap ${styles.contactIn}`}>
        <h2 className="reveal">{m.title}</h2>
        <a className={styles.email} href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <div className={`reveal ${styles.contactFoot}`}>
          <p className={styles.contactLinks}>
            <a href={`tel:${person.phone.replaceAll(" ", "")}`}>{person.phone}</a>
            <a href={person.linkedin}>
              {m.linkedin}
            </a>
            <a href={person.cv}>{m.cv}</a>
          </p>
          <dl className={styles.titleBlock} aria-label={m.block.label}>
            <div className={styles.wide}>
              <dt>{m.block.drawnBy}</dt>
              <dd className={styles.blockName}>{person.name}</dd>
            </div>
            <div>
              <dt>{m.block.role}</dt>
              <dd>{m.block.roleValue}</dd>
            </div>
            <div>
              <dt>{m.block.place}</dt>
              <dd>{m.block.placeValue}</dd>
            </div>
            <div className={styles.wide}>
              <dt>{m.block.scale}</dt>
              <dd>{m.block.scaleValue}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
