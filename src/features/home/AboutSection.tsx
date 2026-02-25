"use client"

import { useTranslations } from "@/shared/context/I18nContext"
import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"

export function AboutSection() {
  const t = useTranslations("about")

  return (
    <Section id="about" className="bg-muted/30">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            label={t("label")}
            title={t("title")}
            align="center"
            className="md:text-center md:mx-auto"
          />
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground leading-relaxed sm:text-base text-center md:text-left">
            {t("description")}
          </p>
        </div>
      </Container>
    </Section>
  )
}

export default AboutSection
