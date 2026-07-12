"use client"

import { useMessages } from "@/shared/context/I18nContext"
import { Rich } from "@/shared/components/Rich"
import { Reveal } from "@/shared/components/Reveal"

const CV_PATH = "/CV-Bui-Thanh-Phuong-Senior-Frontend-Developer.pdf"

type PlatformCell = {
  name: string
  kind: string
  desc: string
  tag: string
}

type Hero = {
  eyebrow: string
  name: string
  lede: string
  viewWork: string
  downloadCv: string
  meta: string[]
  platformMap: {
    title: string
    src: string
    cells: PlatformCell[]
    note: string
  }
}

export function HeroSection() {
  const hero = useMessages<Hero>("hero")
  // Guard against a not-yet-translated locale (partial/legacy dictionary).
  if (!hero?.meta || !hero.platformMap?.cells) return null
  const { platformMap } = hero

  return (
    <header className="hero wrap" id="top">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>{hero.name}</h1>
      <p className="lede">
        <Rich text={hero.lede} />
      </p>
      <div className="cta-row">
        <a className="btn primary" href="#work">
          {hero.viewWork}
        </a>
        <a className="btn ghost" href={CV_PATH} download>
          {hero.downloadCv}
        </a>
      </div>
      <p className="hero-meta">
        {hero.meta.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </p>

      <div className="bundle">
        <div className="bundle-head">
          <span className="bundle-title">{platformMap.title}</span>
          <span className="bundle-src">{platformMap.src}</span>
        </div>
        <div className="plat-grid">
          {platformMap.cells.map((cell, i) => (
            <Reveal key={cell.name} className="plat-cell" delay={i * 100}>
              <div className="plat-name">{cell.name}</div>
              <div className="plat-kind">{cell.kind}</div>
              <div className="plat-desc">{cell.desc}</div>
              <div className="plat-tag">{cell.tag}</div>
            </Reveal>
          ))}
        </div>
        <p className="bundle-note">{platformMap.note}</p>
      </div>
    </header>
  )
}

export default HeroSection
