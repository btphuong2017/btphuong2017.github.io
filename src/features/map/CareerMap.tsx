/**
 * The two-line map, server-rendered SVG from career data: one wide map (time across) and
 * one tall map for phone (time down), from the same geometry. Stations are real links.
 * Below poster width the wide map keeps a readable scale and scrolls sideways, starting at
 * the newest years; the tall map draws one empty stretch shorter, marked and labelled.
 * LineChoice is the only client code: it dims a line, and without JS it never shows.
 */
import type { ReactNode } from "react"
import { formatRange, stations, type Line, type Station } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import type { Messages } from "@/messages"
import { build, pathD, tall, wide, type Layout } from "./geometry"
import { LineChoice } from "./LineChoice"
import styles from "./map.module.css"

type M = Messages["map"]
type Geo = ReturnType<typeof build>

/** Roughly how wide a line of text is, to pick between a band's long and short label. */
const fits = (text: string, size: number, room: number) => text.length * size * 0.56 + 8 <= room

/** Two lines, split at the space nearest the middle. */
function twoLines(text: string): string[] {
  const mid = text.length / 2
  let best = -1
  for (let i = 0; i < text.length; i++) if (text[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i
  return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)]
}

const lineClass = (line: Line) => (line === "inside" ? styles.inside : styles.outside)

function Diamond({ x, y, r, line }: { x: number; y: number; r: number; line: Line }) {
  return <polygon className={`${styles.stop} ${lineClass(line)}`} points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`} />
}

/** An audience: a swatch in its line colour beside the text, both dimmed with the line. */
function Audience({ x, y, size, text, line, anchor }: { x: number; y: number; size: number; text: string; line: Line; anchor: "start" | "end" }) {
  const sx = anchor === "start" ? x : x - 14
  const tx = anchor === "start" ? x + 20 : x - 20
  return (
    <g className={lineClass(line)}>
      <rect className={line === "inside" ? styles.fillInside : styles.fillOutside} x={sx} y={y - size * 0.42} width={14} height={6} />
      <text className={styles.sb} x={tx} y={y} fontSize={size} textAnchor={anchor}>
        {text}
      </text>
    </g>
  )
}

function Tracks({ g, L }: { g: Geo; L: Layout }) {
  return (
    <g aria-hidden="true">
      {g.lines.map((l, i) => (
        <path
          key={i}
          className={`${styles.track} ${lineClass(l.line)} ${l.line === "inside" ? styles.strokeInside : styles.strokeOutside}`}
          d={pathD(l.pts)}
          strokeWidth={L.lw}
          pathLength={1}
        />
      ))}
      {g.spurs.map((s) => (
        <g key={s.station} className={`${styles.spur} ${styles.outside}`}>
          <path className={`${styles.track} ${styles.strokeOutside}`} d={pathD(s.pts)} strokeWidth={L.lw * 0.8} pathLength={1} />
          <path className={`${styles.terminus} ${styles.strokeOutside}`} d={pathD(s.end)} strokeWidth={6} />
        </g>
      ))}
    </g>
  )
}

function Bands({ g, L, m }: { g: Geo; L: Layout; m: M }) {
  const size = 15
  return (
    <g>
      {g.bands.map(({ role, rect }) => {
        const { long, short } = m.band[role]
        const room = L.vertical ? rect.h : rect.w
        // FPT Software is a band only: its short name, set beside the band, where no line runs.
        if (role === "fpt") {
          return (
            <g key={role}>
              <rect className={styles.band} x={rect.x} y={rect.y} width={rect.w} height={rect.h} />
              <text className={styles.sb} x={L.vertical ? rect.x - 10 : rect.x + rect.w} y={L.vertical ? rect.y + rect.h / 2 + 5 : rect.y - 9} fontSize={size + 1} textAnchor="end">
                {short}
              </text>
            </g>
          )
        }
        const label = fits(long, size, room) ? long : fits(short, size, room) ? short : ""
        return (
          <g key={role}>
            <rect className={styles.band} x={rect.x} y={rect.y} width={rect.w} height={rect.h} />
            {label &&
              (L.vertical ? (
                <text className={styles.onBand} x={rect.x + rect.w / 2 - 5.5} y={rect.y + 6} fontSize={size} transform={`rotate(90 ${rect.x + rect.w / 2 - 5.5} ${rect.y + 6})`}>
                  {label}
                </text>
              ) : (
                <text className={styles.onBand} x={rect.x + 8} y={rect.y + 19} fontSize={size}>
                  {label}
                </text>
              ))}
          </g>
        )
      })}
      {g.ticks.map(({ year, t }) =>
        L.vertical ? (
          <g key={year}>
            <rect className={styles.ink} x={0} y={t} width={34} height={2} />
            <text className={styles.sb} x={0} y={t + 18} fontSize={15}>
              {year}
            </text>
          </g>
        ) : (
          <g key={year}>
            <rect className={styles.ink} x={t} y={L.band[1]} width={2} height={22} />
            <text className={styles.sb} x={t + 7} y={L.band[1] + 19} fontSize={15}>
              {year}
            </text>
          </g>
        ),
      )}
      {g.brk && <Break y={g.brk.t} text={m.gap.replace("{n}", String(g.brk.months))} />}
    </g>
  )
}

/** The phone map's shortened stretch: a slanted cut through both lines, and what it hides. */
function Break({ y, text }: { y: number; text: string }) {
  return (
    <g>
      <polygon className={styles.paper} points={`30,${y + 1} 172,${y - 11} 172,${y - 1} 30,${y + 11}`} />
      <path className={styles.cut} d={`M36 ${y + 0.5}L168 ${y - 10.5}M36 ${y + 10.5}L168 ${y - 0.5}`} />
      <text className={styles.date} x={176} y={y - 6} fontSize={15}>
        {twoLines(text).map((r, i) => (
          <tspan key={i} x={176} dy={i ? 19 : 0}>
            {r}
          </tspan>
        ))}
      </text>
    </g>
  )
}

function Titles({ g, L, m }: { g: Geo; L: Layout; m: M }) {
  const size = L.vertical ? 17 : 20
  const block = (line: Line, x: number, y: number, anchorBottom: boolean) => {
    const text = m.lines[line]
    const rows = fits(text, size, L.vertical ? 170 : 190) ? [text] : twoLines(text)
    const y0 = anchorBottom ? y - (rows.length - 1) * size * 1.15 : y
    return (
      <g className={lineClass(line)}>
        <rect className={line === "inside" ? styles.fillInside : styles.fillOutside} x={x} y={y0 - size * 0.45} width={16} height={7} />
        <text className={styles.title} x={x + 24} y={y0} fontSize={size}>
          {rows.map((r, i) => (
            <tspan key={i} x={x + 24} dy={i ? size * 1.15 : 0}>
              {r}
            </tspan>
          ))}
        </text>
      </g>
    )
  }
  if (L.vertical) {
    return (
      <g>
        {block("inside", 176, g.T("2017-06") + 14, false)}
        {block("outside", 176, g.T("2017-06") + 14 + 2 * size * 1.15 + 16, false)}
      </g>
    )
  }
  // Between the lines, where they run apart, in the years with no station.
  const x = g.T("2018-06") + g.off + g.di + 4
  return (
    <g>
      {block("inside", x, L.top + L.lw / 2 + 26, false)}
      {block("outside", x, L.bot - L.lw / 2 - 14, true)}
    </g>
  )
}

/** Where each station's words go. Every station is one link: column, stops and words. */
function StationLink({ s, g, L, m, locale }: { s: Station; g: Geo; L: Layout; m: M; locale: Locale }) {
  const column = g.columns.find((c) => c.station === s.id)
  const t = g.T(s.from)
  const dates = formatRange(s.from, s.to, locale)
  const auds = s.audiences.map((a) => ({ text: m.audiences[a.id], line: a.line }))
  const r = L.lw * 0.55
  const stops = g.stops.filter((p) => p.station === s.id)
  let words: ReactNode
  let hit: { x: number; y: number; w: number; h: number } | null = null

  if (!L.vertical) {
    if (!column) {
      // Spur: words to the left of it, one row per stop.
      const x = t - L.lw / 2 - 10
      words = (
        <>
          <text className={styles.name} x={x} y={L.b + 42} fontSize={26} textAnchor="end">
            {s.name}
          </text>
          <text className={styles.date} x={x} y={L.b + 62} fontSize={15} textAnchor="end">
            {dates}
          </text>
          {auds.map((a, i) => (
            <text key={i} className={`${styles.sb} ${styles.outside}`} x={x} y={stops[i].y + 5} fontSize={15} textAnchor="end">
              {a.text}
            </text>
          ))}
        </>
      )
      hit = { x: x - 150, y: L.b + 14, w: 150 + 10 + L.lw, h: 150 }
    } else if (column.rect.w > 250) {
      // A long interchange: words inside its column, each audience on its own side.
      const inner = t + 2 * g.off + g.di
      const end = column.rect.x + column.rect.w
      const mid = (L.top + L.bot) / 2
      const ins = auds.filter((a) => a.line === "inside")
      const outs = auds.filter((a) => a.line === "outside")
      words = (
        <>
          <text className={styles.name} x={(inner + end) / 2} y={mid + 28} fontSize={88} textAnchor="middle">
            {s.name}
          </text>
          <text className={styles.date} x={(inner + end) / 2} y={mid + 58} fontSize={16} textAnchor="middle">
            {dates}
          </text>
          {ins.map((a, i) => (
            <Audience key={a.text} x={inner + 12} y={L.top - L.lw / 2 - 14 - (ins.length - 1 - i) * 22} size={16} text={a.text} line={a.line} anchor="start" />
          ))}
          {outs.map((a, i) => (
            <Audience key={a.text} x={inner + 12} y={L.bot + L.lw / 2 + 26 + i * 22} size={16} text={a.text} line={a.line} anchor="start" />
          ))}
        </>
      )
    } else {
      // A short interchange: words to the left of its column, above the lines.
      const x = t - 14
      words = (
        <>
          <text className={styles.name} x={x} y={34} fontSize={34} textAnchor="end">
            {s.name}
          </text>
          <text className={styles.date} x={x} y={56} fontSize={15} textAnchor="end">
            {dates}
          </text>
          {auds.map((a, i) => (
            <Audience key={a.text} x={x} y={80 + i * 22} size={15} text={a.text} line={a.line} anchor="end" />
          ))}
        </>
      )
      hit = { x: x - 170, y: 0, w: 170 + 14, h: 108 }
    }
  } else {
    // Phone: words to the right of the lines, one 22 px row per line of small text.
    const x = 176
    const row = 22
    if (!column) {
      // Spur: words under the branch; audiences as a list, like an interchange's.
      words = (
        <>
          <text className={styles.name} x={x} y={t + 32} fontSize={24}>
            {s.name}
          </text>
          <text className={styles.date} x={x} y={t + 52} fontSize={15}>
            {dates}
          </text>
          {auds.map((a, i) => (
            <Audience key={a.text} x={x} y={t + 52 + 24 + i * row} size={15} text={a.text} line={a.line} anchor="start" />
          ))}
        </>
      )
      hit = { x: L.b, y: t - 14, w: L.width - 30 - L.b, h: 14 + 52 + 24 + auds.length * row - 12 }
    } else {
      const big = column.rect.h > 250
      const size = big ? 56 : 28
      const gapAfterDate = big ? 32 : 24
      const block = size * 0.86 + row + gapAfterDate + (auds.length - 1) * row + 6
      // Crowded (Medbuy runs alongside): the words end just before the column starts.
      // Big (VELA): lower down, clear of Medbuy's words.
      const y0 = column.crowded ? t - 8 - block : big ? t + 60 : t
      const base = y0 + size * 0.86
      words = (
        <>
          <text className={styles.name} x={x} y={base} fontSize={size}>
            {s.name}
          </text>
          <text className={styles.date} x={x} y={base + row} fontSize={15}>
            {dates}
          </text>
          {auds.map((a, i) => (
            <Audience key={a.text} x={x} y={base + row + gapAfterDate + i * row} size={15} text={a.text} line={a.line} anchor="start" />
          ))}
        </>
      )
      const top = Math.min(y0, t)
      hit = { x: column.rect.x + column.rect.w, y: top, w: L.width - 30 - column.rect.x - column.rect.w, h: Math.max(column.rect.y + column.rect.h, y0 + block) - top }
    }
  }

  return (
    <a href={s.href} className={`${styles.station} ${column ? "" : styles.outside}`}>
      {column && <rect className={styles.hit} x={column.rect.x} y={column.rect.y} width={column.rect.w} height={column.rect.h} />}
      {hit && <rect className={styles.hit} x={hit.x} y={hit.y} width={hit.w} height={hit.h} />}
      {words}
      {stops.map((p, i) => (
        <Diamond key={i} x={p.x} y={p.y} r={column ? r : r * 0.8} line={p.line} />
      ))}
    </a>
  )
}

function MapSvg({ L, m, locale, className }: { L: Layout; m: M; locale: Locale; className: string }) {
  const g = build(L)
  // Stops are drawn after the lines, inside each link; the lines sit between columns and words.
  return (
    <svg className={className} viewBox={`0 0 ${L.width} ${L.height}`} role="group" aria-label={m.label}>
      {g.columns.map((c) => (
        <rect key={c.station} className={styles.column} x={c.rect.x} y={c.rect.y} width={c.rect.w} height={c.rect.h} aria-hidden="true" />
      ))}
      <Tracks g={g} L={L} />
      <Titles g={g} L={L} m={m} />
      <Bands g={g} L={L} m={m} />
      {stations.map((s) => (
        <StationLink key={s.id} s={s} g={g} L={L} m={m} locale={locale} />
      ))}
    </svg>
  )
}

export function CareerMap({ locale, m }: { locale: Locale; m: M }) {
  return (
    <LineChoice m={m}>
      <div className={styles.scroller}>
        <MapSvg L={wide} m={m} locale={locale} className={styles.wide} />
      </div>
      <MapSvg L={tall} m={m} locale={locale} className={styles.tall} />
      <p className={styles.hint}>
        <span aria-hidden="true">← </span>
        {m.scroll}
      </p>
      <p className={styles.legend}>
        <span className={styles.swatch} aria-hidden="true" />
        <span>
          {m.legend.interchange}. <span className={styles.forWide}>{m.legend.scale}</span>
          <span className={styles.forTall}>{m.legend.scaleTall}</span>
        </span>
      </p>
    </LineChoice>
  )
}
