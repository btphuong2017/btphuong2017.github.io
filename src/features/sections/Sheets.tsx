import { formatRange, stations, type StationId } from "@/content/career"
import type { Locale } from "@/i18n/routing"
import type { Messages } from "@/messages"
import { box, paint, prism, projector, type Solid, type Tone, type V3 } from "./plate"
import styles from "./sections.module.css"

/** A leader from a point on the solid to a label that the line then underlines. */
type Label = { at: V3; x: number; y: number; text: string; anchor?: "start" | "end"; hidden?: boolean }

/** Top, front, side. Side faces carry the drawing's 45° ink hatch over the front shade. */
const FILL: Record<Tone, [string, string, string]> = {
  inside: ["var(--inside)", "var(--inside-1)", "var(--inside-1)"],
  outside: ["var(--outside)", "var(--outside-1)", "var(--outside-1)"],
  sun: ["var(--sun)", "var(--sun-1)", "var(--sun-1)"],
  ink: ["var(--ink)", "var(--ink)", "var(--ink)"],
}
const HATCHED: Tone[] = ["inside", "outside", "sun"]

/** Label size in plate units. Plates use the poster's scale, so this matches the VELA callouts. */
const FONT = 20
const f = (n: number) => n.toFixed(1)

function Plate({
  id,
  w,
  h,
  scale,
  ox,
  oy,
  solids,
  labels,
  label,
}: {
  id: string
  w: number
  h: number
  scale: number
  ox: number
  oy: number
  solids: Solid[]
  labels: Label[]
  label: string
}) {
  const px = projector(scale, ox, oy)
  const fill = (tone: Tone, shade: 0 | 1 | 2) =>
    shade === 2 && HATCHED.includes(tone) ? `url(#${id}-${tone})` : FILL[tone][shade]
  return (
    <svg className={styles.plate} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      <defs>
        {HATCHED.map((tone) => (
          <pattern key={tone} id={`${id}-${tone}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill={FILL[tone][2]} />
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" strokeWidth="1" />
          </pattern>
        ))}
      </defs>
      {paint(solids, px).map((s, i) => (
        <g key={i}>
          {s.polys.map((p) => (
            <polygon key={p.points} points={p.points} fill={fill(p.tone, p.shade)} stroke="var(--ink)" strokeWidth={1} strokeLinejoin="round" />
          ))}
          {s.ribs && <path d={s.ribs} fill="none" stroke="var(--ink)" strokeWidth={0.8} />}
          <path d={s.silhouette} fill="none" stroke="var(--ink)" strokeWidth={2.2 * s.w} strokeLinecap="round" />
        </g>
      ))}
      {labels.map((l) => {
        const [ax, ay] = px(l.at)
        // ponytail: width is estimated from character count, close enough for an underline.
        const width = l.text.length * FONT * 0.55
        const [x0, x1] = l.anchor === "end" ? [l.x - width, l.x] : [l.x, l.x + width]
        // The leader joins the underline at the end facing the plate, so it clears the text.
        const [from, to] = Math.abs(x0 - w / 2) < Math.abs(x1 - w / 2) ? [x0, x1] : [x1, x0]
        return (
          <g key={l.text}>
            <path
              d={`M${f(ax)} ${f(ay)}L${f(from)} ${f(l.y + 6)}H${f(to)}`}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={1.2}
              strokeDasharray={l.hidden ? "6 5" : undefined}
            />
            <circle cx={f(ax)} cy={f(ay)} r={3.4} fill="var(--ink)" />
            <text x={l.x} y={l.y} textAnchor={l.anchor ?? "start"} fontSize={FONT} className={styles.plateText}>
              {l.text}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SogusPlate({ m }: { m: Messages["sheets"]["items"]["sogus"] }) {
  return (
    <Plate
      id="sogus-plate"
      label={m.plateLabel}
      w={620}
      h={400}
      scale={30}
      ox={300}
      oy={258}
      solids={[
        box([-8, -0.3, -4], [8, 0, 4], "sun", { bias: -100, w: 1 }),
        // Three insets on the candidate side: landing, interview, test. Illustrative.
        box([-6.6, 0, -2.5], [-1, 3.4, 2.5], "outside", {
          w: 1.1,
          ribs: [
            [-6.1, -4.5, -2, 2],
            [-4.3, -2.7, -2, 2],
            [-2.5, -1.5, -2, 2],
          ],
        }),
        box([1, 0, -2.5], [6.6, 2.2, 2.5], "inside", { w: 1.1, ribs: [[1.5, 6.1, -2, 2]] }),
      ]}
      labels={[
        { at: [-3.8, 3.4, 0], x: 8, y: 34, text: m.plate.outside },
        { at: [3.8, 2.2, 0], x: 612, y: 34, text: m.plate.inside, anchor: "end" },
        { at: [-6.6, 1.2, 2.5], x: 8, y: 388, text: m.plate.outsideTech },
        { at: [6.6, 1, 2.5], x: 612, y: 388, text: m.plate.insideTech, anchor: "end" },
      ]}
    />
  )
}

function MedbuyPlate({ m }: { m: Messages["sheets"]["items"]["medbuy"] }) {
  const ring = (r: number) =>
    [0, 1, 2].map((n): [number, number] => {
      const t = 0.62 - n * 2.0944
      return [r * Math.sin(t), r * Math.cos(t)]
    })
  const corners = ring(5.4)
  const faceMiddle = (i: number): V3 => {
    const [p, q] = [corners[i], corners[(i + 1) % 3]]
    return [(p[0] + q[0]) / 2, 2, (p[1] + q[1]) / 2]
  }
  const solid: Solid = { ...prism(corners, 0, 4, "outside"), w: 1.1, ribs: [ring(4.2).map(([x, z]): V3 => [x, 4, z])] }
  return (
    <Plate
      id="medbuy-plate"
      label={m.plateLabel}
      w={520}
      h={400}
      scale={30}
      ox={260}
      oy={258}
      solids={[solid]}
      labels={[
        { at: faceMiddle(0), x: 8, y: 388, text: m.plate.suppliers },
        { at: faceMiddle(2), x: 512, y: 388, text: m.plate.agents, anchor: "end" },
        { at: faceMiddle(1), x: 512, y: 34, text: m.plate.endUsers, anchor: "end", hidden: true },
      ]}
    />
  )
}

function KensaPlate({ m }: { m: Messages["sheets"]["items"]["kensa"] }) {
  return (
    <Plate
      id="kensa-plate"
      label={m.plateLabel}
      w={560}
      h={340}
      scale={30}
      ox={250}
      oy={196}
      solids={[
        box([-5, -0.26, -3], [5, 0, 3], "sun", { bias: -100, w: 1 }),
        box([-4.2, 0, -2], [-0.5, 1.5, 2], "inside", { w: 1.1, ribs: [[-3.7, -1, -1.5, 1.5]] }),
        box([0.5, 0, -2], [4.2, 1.5, 2], "outside", { w: 1.1, ribs: [[1, 3.7, -1.5, 1.5]] }),
        box([5, -0.2, -2.2], [6, -0.04, -0.5], "ink"),
        box([5, -0.2, 0.5], [6, -0.04, 2.2], "ink"),
      ]}
      labels={[
        { at: [-2.3, 1.5, 0], x: 8, y: 34, text: m.plate.inside },
        { at: [2.3, 1.5, 0], x: 240, y: 34, text: m.plate.outside },
        { at: [6, -0.12, -1.3], x: 552, y: 100, text: m.plate.vnpay, anchor: "end" },
        { at: [6, -0.12, 1.3], x: 552, y: 300, text: m.plate.payoo, anchor: "end" },
      ]}
    />
  )
}

const plates = {
  sogus: (m: Messages["sheets"]["items"]) => <SogusPlate m={m.sogus} />,
  medbuy: (m: Messages["sheets"]["items"]) => <MedbuyPlate m={m.medbuy} />,
  kensa: (m: Messages["sheets"]["items"]) => <KensaPlate m={m.kensa} />,
}

const sheetIds: Exclude<StationId, "vela">[] = ["sogus", "medbuy", "kensa"]

export function Sheets({ locale, m }: { locale: Locale; m: Messages["sheets"] }) {
  return (
    <section id="sheets" className="section">
      <h2 className="wrap reveal">{m.title}</h2>
      <div className={`wrap ${styles.sheets}`}>
        {sheetIds.map((id) => {
          const item = m.items[id]
          const station = stations.find((s) => s.id === id)!
          return (
            <article key={id} id={id} className={`reveal ${styles.sheet} ${styles[id]}`}>
              <h3>{item.title}</h3>
              <figure className={styles.figure}>
                {plates[id](m.items)}
              </figure>
              <div className={styles.case}>
                <p className={styles.meta}>
                  {formatRange(station.from, station.to, locale)}. {item.role}
                </p>
                <p>{item.body}</p>
                <p>{item.tech}</p>
              </div>
            </article>
          )
        })}
      </div>
      <p className={`wrap ${styles.illustrative}`}>{m.illustrative}</p>
      <div className={styles.earlier}>
        <div className="wrap">
          <h3>{m.earlier.title}</h3>
          <div className={styles.earlierGrid}>
            {m.earlier.items.map((item) => (
              <div key={item.when} className="reveal">
                <p className={styles.when}>{item.when}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
