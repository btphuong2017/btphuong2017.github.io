import type { ReactNode } from "react"
import type { Messages } from "@/messages"
import styles from "./sections.module.css"

/** The first screen. `children` is the map slot, which gets whatever height remains. */
export function Hero({ m, children }: { m: Messages["hero"]; children: ReactNode }) {
  return (
    <section id="map" className={styles.hero}>
      <div className={`wrap ${styles.heroText}`}>
        <h1 className={styles.name}>
          <span>Bùi Thanh</span> <span>Phương</span>
        </h1>
        <p className={styles.thesis}>{m.thesis}</p>
        <p className={styles.sentence}>{m.sentence}</p>
      </div>
      <div className={styles.heroMap}>{children}</div>
    </section>
  )
}
