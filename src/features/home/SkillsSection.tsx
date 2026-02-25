import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { ContentCard } from "@/shared/components/ContentCard"
import { Tag } from "@/shared/components/Tag"
import { Sparkles } from "lucide-react"
import skills from "@/data/skills.json"

export function SkillsSection() {
  return (
    <Section id="skills">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            icon={<Sparkles className="size-3" />}
            label="Skills"
            title="A toolbox for modern product teams"
            description="Breadth across the stack, with a focus on high-quality frontend, design systems, and collaboration."
            align="center"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group) => (
              <ContentCard
                key={group.category}
                className="p-6"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {group.category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {group.items.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <Tag
                      key={skill}
                    >
                      {skill}
                    </Tag>
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

