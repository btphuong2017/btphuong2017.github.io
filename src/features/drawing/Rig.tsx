"use client"

/**
 * The sticky stage, the beats beside it and the parts list. The poster and the beats arrive
 * as server-rendered props; this component only adds the parts-list state and, once the
 * stage nears the viewport and the browser is idle, imports the WebGL engine.
 */
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { Line } from "@/content/career"
import type { Engine } from "./engine"
import styles from "./drawing.module.css"

export type RigText = {
  layers: { id: string; line: Line | null; name: string; summary: string; more: string; tech: string }[]
  /** Callout text by key: messages.drawing.labels, and `repo:<id>` for the rails. */
  callouts: Record<string, string>
  partsTitle: string
  techLabel: string
  hint: string
  illustrative: string
}

export function Rig({ t, poster, children }: { t: RigText; poster: ReactNode; children: ReactNode }) {
  const [sel, setSel] = useState(-1)
  const [active, setActive] = useState(-1)
  const [gl, setGl] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const overlay = useRef<SVGSVGElement>(null)
  const labels = useRef<HTMLDivElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const engine = useRef<Engine | null>(null)
  const selected = useRef(sel)

  useEffect(() => {
    selected.current = sel
    engine.current?.select(sel)
  }, [sel])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(-1)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    // Reduced motion or no WebGL 2: the poster is the drawing.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("WebGL2RenderingContext" in window)) return
    let dead = false
    let idle: number | ReturnType<typeof setTimeout> = 0
    const load = () =>
      import("./engine").then(({ start }) => {
        if (dead) return
        try {
          engine.current = start({
            stage: stage.current!,
            canvas: canvas.current!,
            overlay: overlay.current!,
            labels: labels.current!,
            beats: [...column.current!.querySelectorAll<HTMLElement>("[data-l]")],
            rows: [...list.current!.querySelectorAll<HTMLElement>("button")],
            column: column.current!,
            list: list.current!,
            text: (key) => t.callouts[key] ?? key,
            calloutClass: styles.callout,
            onActive: setActive,
            onPick: (l) => setSel((s) => (l === s ? -1 : l)),
            onClear: () => setSel(-1),
            onGl: setGl,
          })
          engine.current?.select(selected.current)
        } catch {
          // Context creation failed: keep the poster.
        }
      })
    const whenIdle = (fn: () => void) =>
      (idle = "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200))
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return
        io.disconnect()
        whenIdle(load)
      },
      { rootMargin: "50% 0px" },
    )
    // Never before the page has loaded and gone idle; then only once the stage is near.
    const watch = () => whenIdle(() => io.observe(stage.current!))
    if (document.readyState === "complete") watch()
    else addEventListener("load", watch, { once: true })
    return () => {
      dead = true
      removeEventListener("load", watch)
      io.disconnect()
      if (typeof idle === "number" && "cancelIdleCallback" in window) cancelIdleCallback(idle)
      else clearTimeout(idle)
      engine.current?.dispose()
      engine.current = null
      setGl(false)
    }
  }, [t])

  const shown = sel >= 0 ? sel : active
  return (
    <section id="vela" className={styles.rig} aria-labelledby="vela-title" data-sel={sel} data-gl={gl ? "on" : "off"}>
      <div ref={stage} className={styles.stage}>
        {poster}
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        <svg ref={overlay} className={styles.overlay} aria-hidden="true" />
        <div ref={labels} className={styles.labels} aria-hidden="true" />
        <p className={styles.tag} aria-hidden="true">
          {shown >= 0 ? t.layers[shown].name : ""}
        </p>
        <p className={styles.note}>{t.illustrative}</p>
      </div>
      <div ref={column} className={styles.beats}>
        {children}
      </div>
      <div ref={list} className={styles.parts}>
        <h3>{t.partsTitle}</h3>
        <ul>
          {t.layers.map((layer, i) => (
            <li key={layer.id} data-line={layer.line ?? "shared"} data-live={i === shown || undefined}>
              <button type="button" aria-pressed={sel === i} onClick={() => setSel(sel === i ? -1 : i)}>
                <b>{layer.name}</b>
                <span>{layer.summary}</span>
              </button>
              <p>
                {t.techLabel}: {layer.tech}
              </p>
              <p className={styles.more} hidden={sel !== i}>
                {layer.more}
              </p>
            </li>
          ))}
        </ul>
        <p className={styles.hint} hidden={!gl}>
          {t.hint}
        </p>
      </div>
    </section>
  )
}
