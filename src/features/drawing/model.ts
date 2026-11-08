/**
 * The VELA model: one description read by the server poster (SVG) and the lazy WebGL engine.
 * Plain data and math, no three.js. Units are arbitrary; y is up. Counts of Remotes, plates
 * and cases are illustrative, as the copy says.
 *
 * Assembled, bottom to top: Kubernetes rack with Docker cases, the rail deck (4 repos through
 * two gates, the fourth running out to a generic external-systems block), tenant plates, then
 * the three portals side by side: Core one tall blue block, Customer and Supplier each a red
 * Host slab with Remotes on top.
 */
export type V3 = [number, number, number]

/** Layer indices follow `velaLayers` in @/content/career. */
export const CORE = 0
export const PLAT = 1
export const TEN = 2
export const REPO = 3
export const RACK = 4
export const LAYERS = 5

/** 0 paper, 1 hatched paper, 2 ink, 3 inside (blue), 4 outside (red). */
export type Tone = 0 | 1 | 2 | 3 | 4

export type Part = { layer: number; min: V3; max: V3 }
export type Box = { part: number; a: V3; b: V3; tone: Tone; w: number; dashed: boolean; hidden: boolean; bias: number }
/** A loose segment: 4 is an assembly centre line between parts, 5 a thin rib on a face. */
export type Seg = { pa: number; a: V3; pb: number; b: V3; kind: 4 | 5 }

export const parts: Part[] = []
export const boxes: Box[] = []
export const segs: Seg[] = []

function part(layer: number) {
  parts.push({ layer, min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] })
  return parts.length - 1
}

function box(
  i: number,
  a: V3,
  b: V3,
  { tone = 0, w = 1, dashed = false, hidden = false, bias = 0 }: Partial<Omit<Box, "part" | "a" | "b">> = {},
) {
  boxes.push({ part: i, a, b, tone, w, dashed, hidden, bias })
  const p = parts[i]
  for (let k = 0; k < 3; k++) {
    p.min[k] = Math.min(p.min[k], a[k])
    p.max[k] = Math.max(p.max[k], b[k])
  }
}

/** An inset outline on a top face. */
function rib(i: number, x0: number, x1: number, y: number, z0: number, z1: number) {
  segs.push(
    { pa: i, a: [x0, y, z0], pb: i, b: [x1, y, z0], kind: 5 },
    { pa: i, a: [x0, y, z1], pb: i, b: [x1, y, z1], kind: 5 },
    { pa: i, a: [x0, y, z0], pb: i, b: [x0, y, z1], kind: 5 },
    { pa: i, a: [x1, y, z0], pb: i, b: [x1, y, z1], kind: 5 },
  )
}

const guide = (pa: number, a: V3, pb: number, b: V3) => segs.push({ pa, a, pb, b, kind: 4 })

/* ---------- rack: Kubernetes, with Docker cases ---------- */
const rack = part(RACK)
box(rack, [-9, 0, -3.4], [9, 0.4, 3.4], { tone: 1, w: 1.2, bias: -100 })
box(rack, [-9, 2.8, -3.4], [9, 3.2, 3.4], { tone: 1, w: 1.2, bias: 100 })
for (const x of [-9, 8.6]) for (const z of [-3.4, 3]) box(rack, [x, 0.4, z], [x + 0.4, 2.8, z + 0.4])
box(rack, [-0.16, 0.4, -3.4], [0.16, 2.8, -3])
const cases = Array.from({ length: 6 }, (_, n) => {
  const c = part(RACK)
  const x = -8.4 + n * 2.86
  box(c, [x, 0.5, -3], [x + 2.5, 2.7, 3])
  for (let r = 1; r < 6; r++) {
    const rx = x + (r * 2.5) / 6
    segs.push({ pa: c, a: [rx, 0.7, 3], pb: c, b: [rx, 2.5, 3], kind: 5 })
  }
  rib(c, x + 0.2, x + 2.3, 2.7, -2.8, 2.8)
  return c
})

/* ---------- deck: 4 repo rails through two gates ---------- */
const rails = part(REPO)
box(rails, [-9, 3.2, -3.4], [9, 3.45, 3.4], { tone: 1, bias: -50 })
/** Rail z centres, in `velaRepos` order. Tones: Core blue, Customer and Supplier red, integration paper. */
export const railZ = [2.55, 0.85, -0.85, -2.55]
const railTone: Tone[] = [3, 4, 4, 0]
railZ.forEach((z, k) =>
  box(rails, [-9, 3.45, z - 0.26], [k === 3 ? 10.4 : 9, 3.85, z + 0.26], { tone: railTone[k], w: 1.1, hidden: true }),
)
const gate = (x: number) => {
  const g = part(REPO)
  box(g, [x - 0.5, 3.45, -3.75], [x + 0.5, 4.25, -3.3], { tone: 1 })
  box(g, [x - 0.5, 3.45, 3.3], [x + 0.5, 4.25, 3.75], { tone: 1 })
  box(g, [x - 0.5, 3.95, -3.3], [x + 0.5, 4.25, 3.3], { tone: 1, w: 1.15, bias: 60 })
  return g
}
const gateJ = gate(-3.4)
const gateS = gate(2.6)
/** Generic, so drawn in phantom lines. */
const external = part(REPO)
box(external, [10.4, 3.0, -3.9], [12.8, 4.9, -1.2], { dashed: true })

/* ---------- three columns: tenant plates, then the portal on top ---------- */
const COLS: [number, number][] = [
  [-8.8, -3.6],
  [-3, 2.6],
  [3.2, 8.8],
]
const Z0 = -3.2
const Z1 = 3.2
const corePlate = part(TEN)
box(corePlate, [COLS[0][0], 4.3, Z0], [COLS[0][1], 5.12, Z1], { tone: 1 })
rib(corePlate, COLS[0][0] + 0.3, COLS[0][1] - 0.3, 5.12, Z0 + 0.3, Z1 - 0.3)
const plates = [1, 2].map((c) =>
  [0, 1, 2].map((n) => {
    const p = part(TEN)
    const y = 4.3 + n * 0.3
    box(p, [COLS[c][0], y, Z0], [COLS[c][1], y + 0.22, Z1], { tone: 1, bias: n * 10 })
    rib(p, COLS[c][0] + 0.3, COLS[c][1] - 0.3, y + 0.22, Z0 + 0.3, Z1 - 0.3)
    return p
  }),
)

const core = part(CORE)
box(core, [COLS[0][0], 5.2, Z0], [COLS[0][1], 9.6, Z1], { tone: 3, w: 1.35 })
rib(core, COLS[0][0] + 0.35, COLS[0][1] - 0.35, 9.6, Z0 + 0.35, Z1 - 0.35)

const REMOTE_H = [1.8, 1.3, 1.5, 1.1]
const hosts: number[] = []
const remotes = [1, 2].map((c) => {
  const h = part(PLAT)
  hosts.push(h)
  const [x0] = COLS[c]
  box(h, [x0, 5.2, Z0], [COLS[c][1], 5.8, Z1], { tone: 4, w: 1.25, bias: -100 })
  return [0, 1, 2, 3].map((k) => {
    const r = part(PLAT)
    const rx = x0 + 0.15 + (k % 2) * 2.8
    const [rz0, rz1] = k < 2 ? [-2.95, -0.2] : [0.2, 2.95]
    const top = 6 + REMOTE_H[(k + c) % 4]
    const cx = rx + 1.25
    const cz = (rz0 + rz1) / 2
    box(r, [rx, 6, rz0], [rx + 2.5, top, rz1])
    box(r, [cx - 0.4, 5.8, cz - 0.4], [cx + 0.4, 6, cz + 0.4], { tone: 4, bias: -20 })
    rib(r, rx + 0.22, rx + 2.28, top, rz0 + 0.22, rz1 - 0.22)
    guide(r, [cx, 5.8, cz], h, [cx, 5.8, cz])
    return r
  })
})

/* Assembly centre lines: they stretch as the layers come apart. */
for (const [c, i] of [
  [0, corePlate],
  [1, plates[0][0]],
  [2, plates[1][0]],
] as const) {
  const top = c === 0 ? corePlate : plates[c - 1][2]
  const portal = c === 0 ? core : hosts[c - 1]
  for (const x of COLS[c]) {
    guide(portal, [x, 5.2, Z1], top, [x, 5.12, Z1])
    guide(i, [x, 4.3, Z1], rails, [x, 3.45, Z1])
  }
}
for (const x of [-9, 9]) guide(rails, [x, 3.2, 3.4], rack, [x, 3.2, 3.4])

export const ids = { rack, cases, rails, gateJ, gateS, external, corePlate, plates, core, hosts, remotes }
export const N = parts.length

/* ---------- pose: where every part sits at scroll progress p ---------- */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => t * t * (3 - 2 * t)
const ramp = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)))

/** Progress runs 0 (overview) to 6: one unit per beat, the last unit past the last beat. */
export const P_END = 6
/** The frame the poster shows: everything apart, cases out of the rack. */
export const P_POSTER = 5

/**
 * Writes each part's offset into `out` (xyz, w = layer). `iso[l]` 0..1 isolates a layer the
 * reader picked: the whole stack opens and that layer's own move plays.
 */
export function pose(p: number, iso: number[], out: Float32Array, open: number[] = [], spread = 1) {
  const any = Math.max(...iso)
  const sep = Math.max(ramp(p, 0.1, 0.9), any)
  // `spread` < 1 keeps the stack lower on a wide, short stage (phone).
  const lift = [6.6, 6.6, 4.4, 2.2, 0].map((v) => v * spread)
  // `open[l]` 0..1 lifts everything stacked above layer l a little more, so it can be seen.
  const level = [3, 3, 2, 1, 0]
  // The repo deck opens wider: its gate names need paper between the deck and the plates. The
  // platforms, on top, lift off their plates a little so the Host label has paper too.
  const gap = (l: number, lv: number) =>
    level[l] < lv ? (l === REPO ? 4.4 * Math.max(spread, 0.8) : 2.4 * spread) : l === PLAT && lv === 3 ? 1.2 * spread : 0
  const extra = level.map((lv) => open.reduce((sum, t, l) => sum + gap(l, lv) * t, 0))
  parts.forEach((pt, i) => {
    out[i * 4] = 0
    out[i * 4 + 1] = lift[pt.layer] * sep + extra[pt.layer]
    out[i * 4 + 2] = 0
    out[i * 4 + 3] = pt.layer
  })
  const add = (i: number, x: number, y: number, z: number) => {
    out[i * 4] += x
    out[i * 4 + 1] += y
    out[i * 4 + 2] += z
  }
  // Core rises on its own, whole.
  const c = Math.max(ramp(p, 0.55, 1.3), iso[CORE])
  // The two platforms move apart; each column carries its plates.
  const rm = Math.max(ramp(p, 1.45, 2.3), iso[PLAT])
  const colX = [-0.9 * c, -0.35 * rm, 0.9 * rm]
  add(core, colX[0], 1.4 * c, 0)
  add(corePlate, colX[0], 0, 0)
  const fan = Math.max(ramp(p, 2.45, 3.3), iso[TEN])
  ;[0, 1].forEach((k) => {
    add(hosts[k], colX[k + 1], 0, 0)
    remotes[k].forEach((r, n) => add(r, colX[k + 1], 2 * ease(clamp(rm * 1.5 - n * 0.12)), 0))
    plates[k].forEach((pl, n) => add(pl, colX[k + 1], 0.75 * n * fan, 0))
  })
  // Gates slide apart along the rails; SonarQube goes out to the release end, by the external block.
  const g = Math.max(ramp(p, 3.45, 4.3), iso[REPO])
  add(gateJ, -2.4 * g, 0, 0)
  add(gateS, 3.2 * g, 0, 0)
  // Docker cases slide out, then back into the rack.
  const outT = Math.max(ramp(p, 4.4, 4.95), iso[RACK])
  cases.forEach((cs, n) => {
    const back = ramp(p, 5.2 + n * 0.06, 5.65 + n * 0.05)
    add(cs, 0, 0, 4.6 * Math.max(outT * (1 - back), iso[RACK]))
  })
}

/* ---------- view ---------- */

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

export type Basis = { r: V3; u: V3; d: V3 }
/** Right, up and toward-the-viewer vectors for an orthographic view. */
export function basis(yaw: number, pitch: number): Basis {
  const s = Math.sin(yaw)
  const c = Math.cos(yaw)
  const sp = Math.sin(pitch)
  const cp = Math.cos(pitch)
  return { r: [c, 0, -s], u: [-s * sp, cp, -c * sp], d: [s * cp, sp, c * cp] }
}

export const YAW = 0.62
export const PITCH = 0.42

export const moved = (i: number, v: V3, off: Float32Array): V3 => [v[0] + off[i * 4], v[1] + off[i * 4 + 1], v[2] + off[i * 4 + 2]]

/* ---------- labels and leader anchors ---------- */

/**
 * `key` is a key of messages.drawing.labels, or `repo:<id>` for messages.drawing.repos.
 * `side` is where the label would rather stand: 1 right of its anchor, -1 left. Anchors sit on
 * faces that look toward that side, so the leader leaves its own part without crossing another.
 * `names` lists every part the label names, when that is more than the one it points at.
 * `stack` callouts share one aligned column on their side, with orthogonal leaders.
 * `alt` lists spare anchors on parts the label names, tried when the first finds no clear spot.
 */
export type Callout = { key: string; layer: number; part: number; at: V3; side: 1 | -1; names?: number[]; stack?: true; alt?: V3[] }

export const callouts: Callout[] = [
  { key: "core", layer: CORE, part: core, at: [-7, 8.6, Z1], side: -1 },
  { key: "customer", layer: PLAT, part: remotes[0][0], at: [-1.6, 7.3, -1.6], side: -1, names: [hosts[0], ...remotes[0]] },
  { key: "supplier", layer: PLAT, part: remotes[1][0], at: [4.6, 7.5, -1.6], side: 1, names: [hosts[1], ...remotes[1]] },
  { key: "host", layer: PLAT, part: hosts[1], at: [8.8, 5.6, -0.8], side: 1, alt: [[8.8, 5.5, 1.6], [7.6, 5.5, 3.2]] },
  // Not the Remote the parts-list leader lands on, so the two never share a dot.
  { key: "remote", layer: PLAT, part: remotes[1][3], at: [8.65, 6.6, 1.6], side: 1, alt: [[8.65, 6.8, -0.6]], names: remotes.flat() },
  { key: "tenant", layer: TEN, part: plates[1][2], at: [8.8, 4.41, -1.6], side: 1, names: [corePlate, ...plates.flat()], alt: [[-6.2, 5.12, -2]] },
  { key: "jasmine", layer: REPO, part: gateJ, at: [-3.4, 4.25, -3.55], side: -1, alt: [[-3.4, 4.25, -2]] },
  { key: "sonarqube", layer: REPO, part: gateS, at: [2.6, 4.25, -3.55], side: 1, alt: [[2.6, 4.25, -2]] },
  { key: "external", layer: REPO, part: external, at: [12.8, 4.2, -2.6], side: 1 },
  { key: "repo:core", layer: REPO, part: rails, at: [-9, 3.65, railZ[0]], side: -1, stack: true },
  { key: "repo:customer", layer: REPO, part: rails, at: [-9, 3.65, railZ[1]], side: -1, stack: true },
  { key: "repo:supplier", layer: REPO, part: rails, at: [-9, 3.65, railZ[2]], side: -1, stack: true },
  { key: "repo:integration", layer: REPO, part: rails, at: [-9, 3.65, railZ[3]], side: -1, stack: true },
  { key: "docker", layer: RACK, part: cases[4], at: [4.3, 1.6, 3], side: -1, names: cases },
  { key: "kubernetes", layer: RACK, part: rack, at: [-8.8, 1.6, 3.4], side: -1, names: [rack, ...cases] },
]

/**
 * Where each parts-list row's leader may land, one list per layer, best first. All sit on faces
 * that look right, toward the list; the engine takes the first that routes clear of other parts.
 */
export const anchors: { part: number; at: V3 }[][] = [
  [
    { part: core, at: [-3.6, 9.6, Z0] },
    { part: core, at: [-3.6, 9, -1] },
    { part: core, at: [-3.6, 8, 0] },
  ],
  [
    { part: remotes[1][1], at: [8.65, 6.3, -2.6] },
    { part: hosts[1], at: [8.8, 5.5, -1.6] },
    { part: hosts[1], at: [8.8, 5.5, 1.6] },
  ],
  [
    { part: plates[1][2], at: [8.8, 5.01, -1.6] },
    { part: plates[1][1], at: [8.8, 4.71, -1.6] },
    { part: plates[1][0], at: [8.8, 4.41, 0] },
  ],
  [
    { part: external, at: [12.8, 3.5, -1.6] },
    { part: rails, at: [10.4, 3.65, railZ[3]] },
    { part: rails, at: [9, 3.65, railZ[2]] },
    { part: rails, at: [9, 3.3, 0] },
  ],
  [
    { part: rack, at: [9, 1.6, -1] },
    { part: rack, at: [9, 1.6, 1.5] },
    { part: rack, at: [9, 0.2, 0] },
  ],
]
