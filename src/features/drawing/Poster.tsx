/**
 * The drawing as SVG, rendered at build: what readers see without JS, with reduced motion,
 * without WebGL, after a lost context, and until the engine is ready. One fixed frame with
 * everything taken apart. Groups carry data-l so CSS can dim the layers a reader didn't pick.
 */
import type { Messages } from "@/messages"
import { basis, boxes, callouts, dot, LAYERS, moved, N, P_POSTER, parts, PITCH, pose, segs, YAW, type Box, type V3 } from "./model"
import styles from "./drawing.module.css"

const off = new Float32Array(N * 4)
// Extra gaps above the lower three layers: a taller frame suits the tall stage.
pose(P_POSTER, Array(LAYERS).fill(0), off, [0, 0, 1, 1, 1])
const view = basis(YAW, PITCH)
const SCALE = 30
const px = (v: V3): [number, number] => [dot(v, view.r) * SCALE, -dot(v, view.u) * SCALE]
const f = (n: number) => n.toFixed(1)

/** Top, then front/back (z), then side (x): the same three shades as the sheet plates. */
const FILL: Record<Box["tone"], [string, string, string]> = {
  0: ["#f1f4ee", "var(--paper)", "var(--paper-2)"],
  1: ["#f1f4ee", "var(--paper)", "url(#HATCH)"],
  2: ["var(--ink)", "var(--ink)", "var(--ink)"],
  3: ["var(--inside)", "var(--inside-1)", "var(--inside-2)"],
  4: ["var(--outside)", "var(--outside-1)", "var(--outside-2)"],
}

type Face = { n: V3; v: V3[] }
function faces([x0, y0, z0]: V3, [x1, y1, z1]: V3): Face[] {
  return [
    { n: [0, 1, 0], v: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
    { n: [0, -1, 0], v: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
    { n: [0, 0, 1], v: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
    { n: [0, 0, -1], v: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]] },
    { n: [1, 0, 0], v: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]] },
    { n: [-1, 0, 0], v: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]] },
  ]
}

/** Layers are painted bottom up; within a layer, far to near, nudged by each box's bias. */
const RANK = [3, 3, 2, 1, 0]
const order = boxes
  .map((b) => {
    const a = moved(b.part, b.a, off)
    const c = moved(b.part, b.b, off)
    const mid: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]
    return { b, a, c, depth: RANK[parts[b.part].layer] * 1000 + b.bias + dot(mid, view.d) }
  })
  .sort((m, n) => m.depth - n.depth)

/** A part's ribs are drawn right after its last box, so nearer solids still cover them. */
const lastBox = new Map(order.map((o, i) => [o.b.part, i]))

const solids = order.map(({ b, a, c }, i) => {
  const visible = faces(a, c).filter((face) => dot(face.n, view.d) > 1e-6)
  const polys = visible.map((face) => {
    const shade = face.n[1] > 0.5 ? 0 : Math.abs(face.n[2]) > 0.5 ? 1 : 2
    return { points: face.v.map((v) => px(v).map(f).join(",")).join(" "), fill: FILL[b.tone][shade] }
  })
  // Silhouette: edges used by only one visible face.
  const count = new Map<string, [number, number][]>()
  for (const face of visible) {
    const p2 = face.v.map(px)
    p2.forEach((p, k) => {
      const q = p2[(k + 1) % p2.length]
      const key = [p, q].map((v) => v.map(f).join(",")).sort().join("|")
      count.set(key, count.has(key) ? [] : [p, q])
    })
  }
  const silhouette = [...count.values()]
    .filter((e) => e.length)
    .map(([p, q]) => `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`)
    .join("")
  const ribs =
    lastBox.get(b.part) === i
      ? segs
          .filter((s) => s.kind === 5 && s.pa === b.part)
          .map((s) => {
            const [p, q] = [px(moved(s.pa, s.a, off)), px(moved(s.pb, s.b, off))]
            return `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`
          })
          .join("")
      : ""
  return { key: i, layer: parts[b.part].layer, dashed: b.dashed, w: b.w, polys, silhouette, ribs }
})

const guides = segs
  .filter((s) => s.kind === 4)
  .map((s) => {
    const [p, q] = [px(moved(s.pa, s.a, off)), px(moved(s.pb, s.b, off))]
    return `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`
  })
  .join("")

// The frame: every corner of every box.
let [minX, minY, maxX, maxY] = [1e9, 1e9, -1e9, -1e9]
for (const { a, c } of order)
  for (const X of [a[0], c[0]])
    for (const Y of [a[1], c[1]])
      for (const Z of [a[2], c[2]]) {
        const [x, y] = px([X, Y, Z])
        ;[minX, minY, maxX, maxY] = [Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)]
      }

/**
 * Labels stand in two columns beside the model, each side sorted by height and spread so
 * none collide. The four repo names stay out: the beat and the parts list carry them.
 */
const FONT = 26
const GAP = FONT * 1.7
const placed = (["left", "right"] as const).flatMap((side) => {
  let next = -1e9
  return callouts
    .filter((c) => !c.key.startsWith("repo:"))
    .map((c) => {
      const [ax, ay] = px(moved(c.part, c.at, off))
      return { ...c, ax, ay }
    })
    .filter((c) => (c.ax < (minX + maxX) / 2) === (side === "left"))
    .sort((m, n) => m.ay - n.ay)
    .map((c) => {
      const y = Math.max(c.ay, next)
      next = y + GAP
      return { ...c, left: side === "left", x: side === "left" ? minX - 28 : maxX + 28, y }
    })
})
const PAD = 16
const fit = (x0: number, x1: number) => [x0, minY - PAD - FONT, x1 - x0, maxY - minY + 2 * PAD + FONT].map(f).join(" ")
const bare = fit(minX - PAD, maxX + PAD)

/** `labelled`: the desktop variant with callouts; phone gets the bare, larger one. */
export function Poster({ m, labelled: withLabels = false }: { m: Messages["drawing"]; labelled?: boolean }) {
  const text = (key: string) =>
    key.startsWith("repo:") ? m.repos[key.slice(5) as keyof typeof m.repos] : m.labels[key as keyof typeof m.labels]
  const hatch = withLabels ? "vela-hatch-l" : "vela-hatch"
  const labelW = Math.max(...placed.map((p) => text(p.key).length)) * FONT * 0.55
  return (
    <svg
      className={`${styles.poster} ${withLabels ? styles.posterWide : styles.posterBare}`}
      viewBox={withLabels ? fit(minX - 28 - labelW, maxX + 28 + labelW) : bare}
      role="img"
      aria-label={m.stageLabel}
    >
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="var(--paper-2)" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" strokeWidth="1" />
        </pattern>
      </defs>
      {solids.map((s) => (
        <g key={s.key} data-l={s.layer} strokeDasharray={s.dashed ? "7 5" : undefined}>
          {s.polys.map((p) => (
            <polygon key={p.points} points={p.points} fill={p.fill.replace("HATCH", hatch)} stroke="var(--ink)" strokeWidth={1} strokeLinejoin="round" />
          ))}
          <path d={s.silhouette} fill="none" stroke="var(--ink)" strokeWidth={2.6 * s.w} strokeLinecap="round" />
          {s.ribs && <path d={s.ribs} fill="none" stroke="var(--ink)" strokeWidth={0.8} />}
        </g>
      ))}
      <path d={guides} fill="none" stroke="var(--ink)" strokeWidth={0.9} strokeDasharray="14 3 3 3" opacity={0.7} />
      {withLabels &&
        placed.map((p) => {
          const label = text(p.key)
          // ponytail: width estimated from character count, as on the sheet plates.
          const width = label.length * FONT * 0.55
          const [x0, x1] = p.left ? [p.x - width, p.x] : [p.x, p.x + width]
          const near = p.left ? x1 : x0
          return (
            <g key={p.key} data-l={p.layer}>
              <path d={`M${f(p.ax)} ${f(p.ay)}L${f(near)} ${f(p.y + 6)}H${f(p.left ? x0 : x1)}`} fill="none" stroke="var(--ink)" strokeWidth={1.2} />
              <circle cx={f(p.ax)} cy={f(p.ay)} r={3.4} fill="var(--ink)" />
              <text x={f(near)} y={f(p.y)} textAnchor={p.left ? "end" : "start"} fontSize={FONT}>
                {label}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
