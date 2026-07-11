"use client"

import { useTranslations } from "@/shared/context/I18nContext"
import { Reveal } from "@/shared/components/Reveal"

export function ContactSection() {
  const t = useTranslations("contact")
  const email = t("email")
  const phone = t("phone")
  const telHref = `tel:${phone.replace(/\s+/g, "")}`

  return (
    <section id="contact">
      <div className="wrap contact-box">
        <div className="sec-head">
          <h2>{t("title")}</h2>
          <span className="sec-tag">{t("tag")}</span>
        </div>
        <Reveal as="p" className="big">
          {t("headlinePre")}
          <a href={`mailto:${email}`}>{email}</a>
        </Reveal>
        <Reveal className="contact-links">
          <a href={`mailto:${email}`}>{t("links.email")}</a>
          <a href={t("linkedinUrl")} target="_blank" rel="noopener">
            {t("links.linkedin")}
          </a>
          <a href={telHref}>{phone}</a>
          <span style={{ color: "var(--muted)" }}>{t("location")}</span>
        </Reveal>
      </div>
    </section>
  )
}

export default ContactSection
