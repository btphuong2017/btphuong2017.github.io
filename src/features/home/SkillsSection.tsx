"use client"

import { useMessages, useTranslations } from "@/shared/context/I18nContext"
import { Rich } from "@/shared/components/Rich"
import { Reveal } from "@/shared/components/Reveal"

type SkillLine = {
  k: string
  v: string
}

export function SkillsSection() {
  const t = useTranslations("skills")
  const lines = useMessages<SkillLine[]>("skills.lines")
  if (!lines) return null

  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-head">
          <h2>{t("title")}</h2>
          <span className="sec-tag">{t("tag")}</span>
        </div>
        {lines.map((line, i) => (
          <Reveal key={i} className="skill-line">
            <span className="k">{line.k}</span>
            <span className="v">
              <Rich text={line.v} />
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
