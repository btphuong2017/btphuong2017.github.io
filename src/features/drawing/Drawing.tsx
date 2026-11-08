/**
 * VELA, taken apart. Server component: the beats, the parts list text and the SVG poster are
 * all in the static HTML. Rig (client) adds selection and lazy-loads the WebGL engine.
 * The section id "vela" is linked from the map and the nav.
 */
import { velaLayers } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import type { Messages } from "@/messages"
import { Poster } from "./Poster"
import { Rig, type RigText } from "./Rig"
import styles from "./drawing.module.css"

export function Drawing({ m }: { locale: Locale; m: Messages["drawing"] }) {
  const t: RigText = {
    layers: velaLayers.map(({ id, line }) => ({ id, line, ...m.layers[id] })),
    callouts: {
      ...m.labels,
      ...Object.fromEntries(Object.entries(m.repos).map(([id, text]) => [`repo:${id}`, text])),
    },
    partsTitle: m.partsTitle,
    techLabel: m.techLabel,
    hint: m.hint,
    illustrative: m.illustrative,
  }
  return (
    <Rig
      t={t}
      poster={
        <>
          <Poster m={m} labelled />
          <Poster m={m} />
        </>
      }
    >
      {m.beats.map((beat, i) => {
        const Heading = i === 0 ? "h2" : "h3"
        return (
          <article key={beat.id} className={styles.beat} data-l={velaLayers.findIndex((l) => l.id === beat.id)}>
            <Heading id={i === 0 ? "vela-title" : undefined}>{beat.title}</Heading>
            {beat.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {beat.note && <p className={styles.beatNote}>{beat.note}</p>}
          </article>
        )
      })}
    </Rig>
  )
}
