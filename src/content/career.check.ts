// npm run check: dates-to-position and the fact limits on the copy. Needs Node 22.18+.
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { axisPosition, isInterchange, lineSpans, monthsBetween, roles, skillLines, skillProjects, stations, toMonths } from "./career.ts"
import { build, tall, wide, type Pt } from "../features/map/geometry.ts"

assert.equal(toMonths("2017-02") - toMonths("2017-01"), 1)
assert.equal(axisPosition("2017-01"), 0)
assert.equal(axisPosition("2027-01"), 1)
assert.equal(axisPosition("2022-01"), 0.5)
assert.equal(axisPosition("2026-09"), 116 / 120)
assert.equal(monthsBetween("2023-07", "2026-03"), 32) // the ledger's F10

const station = (id: string) => stations.find((s) => s.id === id)!
assert.ok(toMonths(station("medbuy").from) > toMonths(station("sogus").from)) // F20
assert.deepEqual(stations.filter(isInterchange).map((s) => s.id), ["kensa", "sogus", "vela"])
assert.equal(roles.at(-1)!.employer, "FPT Software")
assert.equal(roles.at(-1)!.to, null)

// The map, both layouts: positions to the month, 0° or 45° segments, stops on their line.

const near = (x: number, y: number, what: string) => assert.ok(Math.abs(x - y) < 1e-6, `${what}: ${x} != ${y}`)
const onSegment = ([px, py]: Pt, [ax, ay]: Pt, [bx, by]: Pt) => {
  const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax)
  const dot = (px - ax) * (bx - ax) + (py - ay) * (by - ay)
  return Math.abs(cross) < 1e-6 && dot >= -1e-6 && dot <= (bx - ax) ** 2 + (by - ay) ** 2 + 1e-6
}
const onPolyline = (p: Pt, pts: Pt[]) => pts.slice(1).some((q, i) => onSegment(p, pts[i], q))

for (const L of [wide, tall]) {
  const g = build(L)
  const name = L.vertical ? "tall" : "wide"
  const along = ([x, y]: Pt) => (L.vertical ? y : x)
  // To scale everywhere except a shortened gap, which holds no station, no line end and no role change.
  const gm = L.gap ? [toMonths(L.gap.from) - toMonths("2017-01"), toMonths(L.gap.to) - toMonths("2017-01")] : [0, 0]
  const perMonth = (L.len - (L.gap?.len ?? 0)) / (120 - (gm[1] - gm[0]))
  const expect = (m: number) => L.t0 + (m <= gm[0] ? m : m - (gm[1] - gm[0])) * perMonth + (m >= gm[1] ? (L.gap?.len ?? 0) : 0)
  for (const year of [2017, 2018, 2021, 2023, 2026]) near(g.ticks.find((t) => t.year === year)!.t, expect((year - 2017) * 12), `${name} tick ${year}`)
  if (L.gap) {
    const g0 = L.gap.from
    const g1 = L.gap.to
    const inside = (ym: string) => ym > g0 && ym < g1
    const dates = [...stations.flatMap((s) => [s.from, s.to]), ...lineSpans.flatMap((s) => [s.from, s.to]), ...roles.flatMap((r) => [r.from, r.to ?? "2027-01"])]
    assert.ok(!dates.some(inside), `${name}: a date falls inside the shortened gap`)
    assert.ok(g.brk && g.brk.months === gm[1] - gm[0], `${name}: the gap has no break mark`)
    assert.ok(g.ticks.every((t) => !inside(`${t.year}-01`)), `${name}: a tick inside the gap`)
  }
  for (const c of g.columns) {
    const s = station(c.station)
    const r = c.rect
    const [t0, t1] = L.vertical ? [r.y, r.y + r.h] : [r.x, r.x + r.w]
    assert.ok(Math.abs(t0 - g.T(s.from)) <= 1.5 && Math.abs(t1 - g.T(s.to)) <= 1.5, `${name} column ${s.id} off its dates`)
  }
  for (const line of ["inside", "outside"] as const) {
    const spans = g.lines.filter((l) => l.line === line)
    assert.equal(spans.length, lineSpans.length, `${name} ${line}: one path per span`)
    spans.forEach((l, i) => {
      near(along(l.pts[0]), g.T(lineSpans[i].from), `${name} ${line} starts`)
      near(along(l.pts.at(-1)!), g.T(lineSpans[i].to), `${name} ${line} ends`)
      l.pts.slice(1).forEach(([x, y], k) => {
        const dx = Math.abs(x - l.pts[k][0])
        const dy = Math.abs(y - l.pts[k][1])
        assert.ok(dx < 1e-6 || dy < 1e-6 || Math.abs(dx - dy) < 1e-6, `${name} ${line}: segment not 0° or 45°`)
        assert.ok((L.vertical ? y - l.pts[k][1] : x - l.pts[k][0]) >= -1e-6, `${name} ${line} runs back in time`)
      })
    })
    for (const stop of g.stops.filter((s) => s.line === line && station(s.station).id !== "medbuy")) {
      near(along([stop.x, stop.y]), g.T(station(stop.station).from), `${name} ${stop.station} stop date`)
      assert.ok(spans.some((l) => onPolyline([stop.x, stop.y], l.pts)), `${name} ${stop.station} off the ${line} line`)
    }
  }
  const medbuy = g.stops.filter((s) => s.station === "medbuy")
  const spur = g.spurs.find((s) => s.station === "medbuy")!
  assert.equal(medbuy.length, 3)
  assert.ok(medbuy.every((s) => s.line === "outside" && onPolyline([s.x, s.y], spur.pts)), `${name} Medbuy stops off the spur`)
  near(along(spur.pts[0]), g.T(station("medbuy").from), `${name} Medbuy spur date`)
  assert.ok(onSegment(spur.pts.at(-1)!, spur.end[0], spur.end[1]), `${name} Medbuy terminus off the spur's end`)
  assert.ok(spur.pts.every((p) => along(p) < g.T(station("medbuy").to)), `${name} Medbuy spur past its end`)
  const fpt = g.bands.find((b) => b.role === "fpt")!.rect
  near(L.vertical ? fpt.y : fpt.x, g.T("2026-09"), `${name} FPT band`)
  assert.ok(g.lines.every((l) => l.pts.every((p) => along(p) <= g.T("2026-03") + 1e-6)), `${name}: a line runs past 3/2026`)
}

const banned =
  /Signals|Standalone|\.NET|GitLab|Reactive Forms|bundle-analyzer|15\+|60\+|Frontend Architect|Saigon|Sài Gòn|btphuong\.dev|8 năm|8 years|NDA|confidential|bảo mật|Lighthouse (score|[0-9])|open to work/

for (const locale of ["vi", "en"]) {
  const raw = readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")
  assert.equal(raw, raw.normalize("NFC"), `${locale}.json is not NFC`)
  assert.equal(banned.exec(raw)?.[0], undefined, `${locale}.json has a banned term`)

  // Skill lines: every stop has its text, and no text sits where the line doesn't stop.
  const skills = JSON.parse(raw).skills
  assert.deepEqual(Object.keys(skills.projects), skillProjects, `${locale}: skills.projects`)
  assert.deepEqual(Object.keys(skills.groups), skillLines.map((l) => l.id), `${locale}: skills.groups`)
  for (const { id, stops } of skillLines) {
    const text: Record<string, string> = skills.groups[id].stops ?? {}
    assert.deepEqual(Object.keys(text).sort(), [...stops].sort(), `${locale}: skills ${id} stops`)
    assert.ok(Object.values(text).every((t) => t.trim()), `${locale}: skills ${id} has an empty stop`)
    if (!stops.length) assert.ok(skills.groups[id].usedFor?.trim(), `${locale}: skills ${id} needs usedFor`)
  }
}

console.log("career check ok")
