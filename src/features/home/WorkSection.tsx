"use client"

import { Fragment, type ReactNode } from "react"
import { useMessages } from "@/shared/context/I18nContext"
import { Rich } from "@/shared/components/Rich"
import { Reveal } from "@/shared/components/Reveal"

type WorkLabels = {
  problem: string
  decision: string
  outcome: string
  role: string
  tech: string
}

type WorkRow = {
  name: string
  meta: string
  problem: string
  decision: string
  outcome: string
  role: string
  tech: string
  arch?: string
}

type Work = {
  title: string
  tag: string
  labels: WorkLabels
  rows: WorkRow[]
}

/** Renders the mono architecture diagram: `**...**` segments become accent <i>. */
function ArchDiagram({ text }: { text: string }): ReactNode {
  const parts = text.split("**")
  return (
    <div className="arch">
      {parts.map((part, i) =>
        i % 2 === 1 ? <i key={i}>{part}</i> : <Fragment key={i}>{part}</Fragment>
      )}
    </div>
  )
}

export function WorkSection() {
  const work = useMessages<Work>("work")
  if (!work) return null
  const { labels } = work

  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head">
          <h2>{work.title}</h2>
          <span className="sec-tag">{work.tag}</span>
        </div>

        {work.rows.map((row) => (
          <Reveal key={row.name} as="article" className="work-row">
            <div className="wr-head">
              <span className="wr-name">{row.name}</span>
              <span className="wr-meta">{row.meta}</span>
            </div>
            <div className="wr-grid">
              <div className="wr-item">
                <span className="k">{labels.problem}</span>
                <p>{row.problem}</p>
              </div>
              <div className="wr-item">
                <span className="k">{labels.decision}</span>
                <p>
                  <Rich text={row.decision} />
                </p>
              </div>
              <div className="wr-item">
                <span className="k">{labels.outcome}</span>
                <p>
                  <Rich text={row.outcome} />
                </p>
              </div>
              <div className="wr-item">
                <span className="k">{labels.role}</span>
                <p>{row.role}</p>
              </div>
            </div>
            {row.arch ? <ArchDiagram text={row.arch} /> : null}
            <p className="wr-tech">
              <b>{labels.tech}</b>
              {"  "}
              {row.tech}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default WorkSection
