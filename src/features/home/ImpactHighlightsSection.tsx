"use client"

import { useTranslations } from "@/shared/context/I18nContext"
import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { MetricCard } from "@/shared/components/MetricCard"
import {
  Briefcase,
  Users,
  Layers,
  Building2,
  Rocket,
} from "lucide-react"

export function ImpactHighlightsSection() {
  const t = useTranslations("impact")

  return (
    <Section id="impact" className="bg-muted/30">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            label={t("label")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="md:text-center md:mx-auto"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Briefcase className="size-5" />}
              value="8+"
              label={t("yearsLabel")}
              description={t("yearsDesc")}
            />
            <MetricCard
              icon={<Users className="size-5" />}
              value="8"
              label={t("teamsLabel")}
              description={t("teamsDesc")}
            />
            <MetricCard
              icon={<Layers className="size-5" />}
              value="Nx"
              label={t("architectureLabel")}
              description={t("architectureDesc")}
            />
            <MetricCard
              icon={<Building2 className="size-5" />}
              value="3"
              label={t("scaleLabel")}
              description={t("scaleDesc")}
            />
            <MetricCard
              icon={<Rocket className="size-5" />}
              value="15+"
              label={t("domainLabel")}
              description={t("domainDesc")}
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ImpactHighlightsSection
