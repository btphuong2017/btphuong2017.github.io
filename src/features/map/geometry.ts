/**
 * The map's geometry, pure numbers from career data. One model in (t, u): t runs along
 * time, u across it. The wide map draws x = t, y = u; the phone map turns it, x = u, y = t.
 * Erasable TypeScript with a `.ts` import, so `npm run check` can test it in plain Node.
 */
import {
  axis,
  axisPosition,
  axisYears,
  isInterchange,
  monthsBetween,
  lineSpans,
  roles,
  stations,
  type Line,
  type RoleId,
  type Station,
  type StationId,
  type Ym,
} from "../../content/career.ts"

export type Pt = [number, number]
export type Rect = { x: number; y: number; w: number; h: number }

export type Layout = {
  vertical: boolean
  /** Where the axis starts along t, and its length. */
  t0: number
  len: number
  /** Empty months drawn shorter than to scale, with a break mark and a label. */
  gap?: { from: Ym; to: Ym; len: number }
  /** Across positions: inside spread out, inside at a station, outside at a station, outside spread out. */
  top: number
  a: number
  b: number
  bot: number
  lw: number
  /** Across extent of an interchange column, and of the employer band. */
  col: [number, number]
  band: [number, number]
  /** The outside-only spur, in (t, u), from the station's start. Its stops lie on it. */
  spur: (t: number) => Pt[]
  spurStops: (t: number) => Pt[]
  width: number
  height: number
}

export const wide: Layout = {
  vertical: false,
  t0: 0,
  len: 1360,
  top: 126,
  a: 200,
  b: 272,
  bot: 346,
  lw: 22,
  col: [0, 436],
  band: [436, 462],
  spur: (t) => [
    [t, 272],
    [t, 424],
  ],
  spurStops: (t) => [83, 111, 139].map((u): Pt => [t, 272 + u]),
  width: 1360,
  height: 486,
}

// Phone: 10.5 px a month, except 1/2019 to 7/2020, where nothing happens on either line.
export const tall: Layout = {
  vertical: true,
  t0: 24,
  len: 102 * 10.5 + 40,
  gap: { from: "2019-01", to: "2020-07", len: 40 },
  top: 56,
  a: 84,
  b: 120,
  bot: 148,
  lw: 16,
  col: [44, 160],
  band: [338, 360],
  // Across time, as on the wide map: a branch off to the side at its start date.
  spur: (t) => [
    [t, 120],
    [t, 262],
  ],
  spurStops: (t) => [40, 80, 120].map((u): Pt => [t, 120 + u]),
  width: 360,
  height: 24 + 102 * 10.5 + 40 + 34,
}

export type Stop = { station: StationId; line: Line; x: number; y: number }

export function build(L: Layout) {
  const months = (ym: Ym) => monthsBetween(axis.from, ym)
  const gap = L.gap && { m0: months(L.gap.from), m1: months(L.gap.to), len: L.gap.len }
  const T = (ym: Ym) => {
    if (!gap) return L.t0 + axisPosition(ym) * L.len
    const k = (L.len - gap.len) / (months(axis.to) - (gap.m1 - gap.m0))
    const m = months(ym)
    if (m <= gap.m0) return L.t0 + m * k
    if (m >= gap.m1) return L.t0 + (m - gap.m1 + gap.m0) * k + gap.len
    return L.t0 + gap.m0 * k + ((m - gap.m0) / (gap.m1 - gap.m0)) * gap.len
  }
  const P = ([t, u]: Pt): Pt => (L.vertical ? [u, t] : [t, u])
  const rect = (t0: number, t1: number, u0: number, u1: number): Rect => {
    const [x0, y0] = P([t0, u0])
    const [x1, y1] = P([t1, u1])
    return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) }
  }
  const at = (id: StationId) => stations.find((s) => s.id === id)!
  const [kx, ke, sx, vx] = [T(at("kensa").from), T(at("kensa").to), T(at("sogus").from), T(at("vela").from)]
  const { top, a, b, bot } = L
  const off = Math.min(30, (sx - ke) / 6)
  const j = Math.min(40, (sx - ke) / 4, (a - top) / 2)
  const di = a - top
  const dout = bot - b

  // The first span is the internship, straight. The second bends out between stations and
  // comes together at each interchange, inside jogging out between Kensa and SOGUS.
  const route = (line: Line, from: number, to: number, first: boolean): Pt[] => {
    if (first) return line === "inside" ? [[from, a], [to, a]] : [[from, b], [to, b]]
    return line === "inside"
      ? [
          [from, a], [from + off, a], [from + off + di, top], [kx - off - di, top], [kx - off, a],
          [ke + off, a], [ke + off + j, a - j], [sx - off - j, a - j], [sx - off, a],
          [vx + 2 * off, a], [vx + 2 * off + di, top], [to, top],
        ]
      : [
          [from, b], [from + off, b], [from + off + dout, bot], [kx - off - dout, bot], [kx - off, b],
          [vx + 2 * off, b], [vx + 2 * off + dout, bot], [to, bot],
        ]
  }

  const lines = (["inside", "outside"] as Line[]).flatMap((line) =>
    lineSpans.map((span, i) => ({ line, pts: route(line, T(span.from), T(span.to), i === 0).map(P) })),
  )

  // A non-interchange station running at the same time takes the far part of the column.
  const crowded = (s: Station) =>
    stations.some((o) => !isInterchange(o) && o.from < s.to && o.to > s.from && o !== s)
  // Columns that meet keep a hairline of paper between them.
  const interchanges = stations.filter(isInterchange)
  const meets = (ym: Ym) => interchanges.filter((o) => o.from === ym || o.to === ym).length > 1
  const columns = interchanges.map((s) => ({
    station: s.id,
    crowded: crowded(s),
    rect: rect(
      T(s.from) + (meets(s.from) ? 1.5 : 0),
      T(s.to) - (meets(s.to) ? 1.5 : 0),
      L.col[0],
      crowded(s) ? b + L.lw / 2 + 6 : L.col[1],
    ),
  }))

  const stops: Stop[] = stations.flatMap((s) => {
    if (isInterchange(s))
      return (["inside", "outside"] as Line[]).map((line) => {
        const [x, y] = P([T(s.from), line === "inside" ? a : b])
        return { station: s.id, line, x, y }
      })
    return L.spurStops(T(s.from)).map((p) => {
      const [x, y] = P(p)
      return { station: s.id, line: "outside" as Line, x, y }
    })
  })

  // A spur ends in a terminus bar across its last segment.
  const spurs = stations
    .filter((s) => !isInterchange(s))
    .map((s) => {
      const pts = L.spur(T(s.from)).map(P)
      const [[px, py], [qx, qy]] = pts.slice(-2)
      const d = Math.hypot(qx - px, qy - py)
      const [nx, ny] = [((py - qy) / d) * L.lw * 0.7, ((qx - px) / d) * L.lw * 0.7]
      return { station: s.id, pts, end: [[qx - nx, qy - ny], [qx + nx, qy + ny]] as Pt[] }
    })

  const bands = roles.map((r, i) => {
    const t1 = T(r.to ?? axis.to)
    const touching = i > 0 && roles[i - 1].to === r.from
    return { role: r.id as RoleId, rect: rect(T(r.from) + (touching ? 1 : 0), t1, L.band[0], L.band[1]) }
  })

  // Years inside a shortened gap get no tick; the break mark sits in the middle of the gap.
  const ticks = axisYears
    .filter((year) => !gap || months(`${year}-01`) < gap.m0 || months(`${year}-01`) > gap.m1)
    .map((year) => ({ year, t: T(`${year}-01`) }))
  const brk = L.gap && { t: (T(L.gap.from) + T(L.gap.to)) / 2, months: months(L.gap.to) - months(L.gap.from) }

  return { T, P, rect, lines, columns, stops, spurs, bands, ticks, brk, off, di }
}

export const pathD = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${+x.toFixed(2)} ${+y.toFixed(2)}`).join("L")
