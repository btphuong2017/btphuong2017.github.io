"use client"

import { useTranslations } from "@/shared/context/I18nContext"

import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { ContentCard } from "@/shared/components/ContentCard"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import skills from "@/data/skills.json"

export function SkillsSection() {
  const t = useTranslations("skills")

  return (
    <Section id="skills">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            icon={<Sparkles className="size-3" />}
            label={t("label")}
            title={t("title")}
            description={t("description")}
            align="center"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group) => (
              <ContentCard
                key={group.group}
                className="p-6"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {t(`groups.${group.group}`)}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {group.items.length} {t("skillCount")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-border bg-background/60 text-xs font-normal text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </ContentCard>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default SkillsSection

