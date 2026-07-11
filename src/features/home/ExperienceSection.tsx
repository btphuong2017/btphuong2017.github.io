"use client"

import { useMessages, useTranslations } from "@/shared/context/I18nContext"
import { Reveal } from "@/shared/components/Reveal"

type ExperienceItem = {
  role: string
  org: string
  dates: string
  desc: string
}

export function ExperienceSection() {
  const t = useTranslations("experience")
  const items = useMessages<ExperienceItem[]>("experience.items")
  if (!items) return null

  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-head">
          <h2>{t("title")}</h2>
          <span className="sec-tag">{t("tag")}</span>
        </div>
        <div className="xp">
          {items.map((item, i) => (
            <Reveal key={i} className="xp-item">
              <div className="xp-head">
                <div>
                  <div className="xp-role">{item.role}</div>
                  <div className="xp-org">{item.org}</div>
                </div>
                <span className="xp-dates">{item.dates}</span>
              </div>
              <p className="desc">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
