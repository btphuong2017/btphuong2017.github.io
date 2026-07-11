"use client"

import { useMessages } from "@/shared/context/I18nContext"
import { Reveal } from "@/shared/components/Reveal"

type Metric = {
  num: string
  label: string
  accent?: boolean
}

export function MetricsStrip() {
  const items = useMessages<Metric[]>("metrics.items")
  if (!items) return null

  return (
    <section id="numbers">
      <div className="wrap">
        <Reveal className="metrics">
          {items.map((item, i) => (
            <div className="metric" key={i}>
              <div className="num">
                {item.accent ? <em>{item.num}</em> : item.num}
              </div>
              <div className="lab">{item.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default MetricsStrip
