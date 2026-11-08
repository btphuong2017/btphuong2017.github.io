"use client"

/**
 * Skill lines: each CV group is a line across the projects in time order, with a stop only
 * where the CV says the group was used. Server HTML holds every group, item and stop text.
 * With JS: pick a group or a project (Escape clears), and each line draws in as it enters.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { formatYm, roles, skillLines, skillProjects, stations, type SkillGroupId, type SkillProjectId } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import type { Messages } from "@/messages"
import styles from "./skills.module.css"

type M = Messages["skills"]
type Choice = { group: SkillGroupId } | { project: SkillProjectId } | null

const senior = roles.find((r) => r.id === "senior")!

/** AMIT is the senior years; on phone its end year drops the century ("2021–23") to fit its column. */
function when(p: SkillProjectId, locale: Locale) {
  if (p !== "amit") return formatYm(stations.find((s) => s.id === p)!.from, locale)
  const end = senior.to!.slice(0, 4)
  return (
    <>
      {senior.from.slice(0, 4)}–<span className={styles.century}>{end.slice(0, 2)}</span>
      {end.slice(2)}
    </>
  )
}

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, k) => values[k])
const col = (c: number) => ({ "--c": c }) as CSSProperties

export function Skills({ m }: { m: M }) {
  const [choice, setChoice] = useState<Choice>(null)
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- buttons only once they work
    setReady(true)
    if (!matchMedia("(prefers-reduced-motion: no-preference)").matches || !("IntersectionObserver" in window)) return
    // Lines start undrawn only now; without JS they are simply there. Each row draws as it enters.
    const rows = [...ref.current!.querySelectorAll<HTMLElement>("[data-row]")]
    rows.forEach((r) => (r.dataset.draw = "wait"))
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, k) => {
            const r = e.target as HTMLElement
            r.style.setProperty("--k", String(k))
            r.dataset.draw = "go"
            io.unobserve(r)
          })
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!choice) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChoice(null)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [choice])

  const group = choice && "group" in choice ? choice.group : null
  const project = choice && "project" in choice ? choice.project : null
  const toggle = (next: NonNullable<Choice>) =>
    setChoice((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? null : next))

  const name = (id: SkillGroupId) => m.groups[id].name
  const stopText = (id: SkillGroupId, p: SkillProjectId) => (m.groups[id] as { stops?: Partial<Record<SkillProjectId, string>> }).stops?.[p]

  let status = m.hint
  if (project) {
    const at = skillLines.filter((l) => l.stops.includes(project)).map((l) => name(l.id))
    status = fill(m.atProject, { project: m.projects[project], groups: at.join(", ") })
  } else if (group) {
    const stops = skillLines.find((l) => l.id === group)!.stops
    status = stops.length
      ? fill(m.onGroup, { group: name(group), projects: skillProjects.filter((p) => stops.includes(p)).map((p) => m.projects[p]).join(", ") })
      : `${name(group)}. ${m.groups.ai.usedFor}`
  }

  return (
    <section id="skills" className="section">
      <div className="wrap">
        <h2 className="reveal">{m.title}</h2>
        <p className={styles.status} aria-live="polite" hidden={!ready}>
          {status}
        </p>
      </div>
      <div ref={ref} className={`${styles.matrix} ${ready ? styles.ready : ""}`}>
        {project && <div className={styles.field} style={col(skillProjects.indexOf(project))} aria-hidden="true" />}
        <div className={styles.head} role="group" aria-label={m.projectsLabel}>
          {skillProjects.map((p, c) => {
            const label = (
              <>
                <span className={styles.project}>{m.projects[p]}</span>
                <span className={styles.when}>{when(p, m.lang as Locale)}</span>
              </>
            )
            return ready ? (
              <button key={p} type="button" className={styles.col} style={col(c)} aria-pressed={project === p} onClick={() => toggle({ project: p })}>
                {label}
              </button>
            ) : (
              <span key={p} className={styles.col} style={col(c)}>
                {label}
              </span>
            )
          })}
        </div>
        {skillLines.map(({ id, stops }) => {
          const g = m.groups[id]
          const lit = group === id
          const dim = (group && !lit) || (project && !stops.includes(project))
          return (
            <div key={id} data-row className={styles.row} data-lit={lit || undefined} data-dim={dim || undefined}>
              <h3 className={styles.name}>
                {ready ? (
                  <button type="button" aria-pressed={lit} onClick={() => toggle({ group: id })}>
                    {g.name}
                  </button>
                ) : (
                  g.name
                )}
              </h3>
              <div className={styles.track} aria-hidden="true">
                <svg className={styles.svg} viewBox="0 0 500 28" preserveAspectRatio="none">
                  <path className={styles.line} d="M0 14H500" pathLength={1} />
                </svg>
                {skillProjects.map((p, c) => (
                  <span key={p} className={styles.cell} style={col(c)} data-on={project === p || undefined}>
                    <span className={stops.includes(p) ? styles.stop : styles.tick} />
                  </span>
                ))}
              </div>
              <p className={styles.items}>{g.items.join(", ")}</p>
              {"usedFor" in g && <p className={styles.used}>{g.usedFor}</p>}
              {stops.length > 0 && (
                <dl className={styles.where}>
                  {skillProjects
                    .filter((p) => stops.includes(p))
                    .map((p) => (
                      <div key={p} className={styles.at} style={col(skillProjects.indexOf(p))}>
                        <dt>{m.projects[p]}</dt>
                        <dd>{stopText(id, p)}</dd>
                      </div>
                    ))}
                </dl>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
