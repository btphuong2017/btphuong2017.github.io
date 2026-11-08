/**
 * The projection for the sheet plates, ported from the prototype: boxes and prisms seen
 * from one fixed angle, painted back to front. Runs at build; the output is plain SVG.
 */
export type V3 = [number, number, number]
export type Tone = "inside" | "outside" | "sun" | "ink"

type Face = { n: V3; v: V3[] }
export type Solid = { faces: Face[]; center: V3; tone: Tone; bias?: number; ribs?: V3[][]; w?: number }

export type Polygon = { points: string; tone: Tone; shade: 0 | 1 | 2 }
/** One solid as the drawing inks it: faces, a heavy silhouette and thin ribs on the top. */
export type Inked = { polys: Polygon[]; silhouette: string; ribs: string; w: number }

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const YAW = 0.62
const PITCH = 0.5
const right: V3 = [Math.cos(YAW), 0, -Math.sin(YAW)]
const up: V3 = [-Math.sin(YAW) * Math.sin(PITCH), Math.cos(PITCH), -Math.cos(YAW) * Math.sin(PITCH)]
const toward: V3 = [Math.sin(YAW) * Math.cos(PITCH), Math.sin(PITCH), Math.cos(YAW) * Math.cos(PITCH)]

/** `ribs`: inset outlines on the top face, as [x0, x1, z0, z1] rectangles. */
export const box = (a: V3, b: V3, tone: Tone, { bias = 0, ribs = [] as number[][], w = 1 } = {}): Solid => {
  const [x0, y0, z0] = a
  const [x1, y1, z1] = b
  return {
    tone,
    bias,
    w,
    ribs: ribs.map(([rx0, rx1, rz0, rz1]): V3[] => [[rx0, y1, rz0], [rx1, y1, rz0], [rx1, y1, rz1], [rx0, y1, rz1]]),
    center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
    faces: [
      { n: [0, 1, 0], v: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
      { n: [0, 0, 1], v: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
      { n: [1, 0, 0], v: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]] },
      { n: [0, 0, -1], v: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]] },
      { n: [-1, 0, 0], v: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]] },
    ],
  }
}

export const prism = (points: [number, number][], y0: number, y1: number, tone: Tone): Solid => ({
  tone,
  center: [0, (y0 + y1) / 2, 0],
  faces: [
    { n: [0, 1, 0], v: points.map(([x, z]): V3 => [x, y1, z]).reverse() },
    ...points.map(([x, z], i): Face => {
      const [x2, z2] = points[(i + 1) % points.length]
      const length = Math.hypot(z2 - z, x2 - x)
      return {
        n: [(z2 - z) / length, 0, -(x2 - x) / length],
        v: [[x, y0, z], [x2, y0, z2], [x2, y1, z2], [x, y1, z]],
      }
    }),
  ],
})

/** Screen projection for a plate with the given scale and origin. */
export const projector = (scale: number, ox: number, oy: number) => (v: V3): [number, number] => [
  ox + dot(v, right) * scale,
  oy - dot(v, up) * scale,
]

const f = (n: number) => n.toFixed(1)

/** Visible faces of the solids, painted far to near. Top is shade 0, front 1, side 2. */
export function paint(solids: Solid[], px: (v: V3) => [number, number]): Inked[] {
  return solids
    .map((solid) => ({ solid, depth: dot(solid.center, toward) + (solid.bias ?? 0) }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ solid }) => {
      const visible = solid.faces.filter((face) => dot(face.n, toward) > 1e-6)
      // Silhouette, as in the VELA poster: edges that only one visible face uses.
      const edges = new Map<string, string>()
      for (const face of visible) {
        const p2 = face.v.map(px)
        p2.forEach((p, k) => {
          const q = p2[(k + 1) % p2.length]
          const key = [p, q].map((v) => v.map(f).join(",")).sort().join("|")
          edges.set(key, edges.has(key) ? "" : `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`)
        })
      }
      const loop = (vs: V3[]) => vs.map((v, k) => `${k ? "L" : "M"}${px(v).map(f).join(" ")}`).join("") + "Z"
      return {
        w: solid.w ?? 1,
        silhouette: [...edges.values()].join(""),
        ribs: (solid.ribs ?? []).map(loop).join(""),
        polys: visible.map((face): Polygon => ({
          tone: solid.tone,
          shade: face.n[1] > 0.5 ? 0 : Math.abs(face.n[0]) > Math.abs(face.n[2]) ? 2 : 1,
          points: face.v.map((v) => px(v).map(f).join(",")).join(" "),
        })),
      }
    })
}
