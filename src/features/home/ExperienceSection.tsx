import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar } from "lucide-react"
import experience from "@/data/experience.json"

export function ExperienceSection() {
  return (
    <Section id="experience">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            icon={<Briefcase className="size-3" />}
            label="Experience"
            title="Professional journey"
            description="8+ years growing teams, shipping products, and shaping frontend architecture."
            align="center"
            className="md:text-center"
          />

          <div className="space-y-6">
            {experience.map((job) => (
              <div key={job.id} className="flex gap-4">
                <div className="mt-3 hidden h-full w-px bg-border sm:block" />
                <Card className="flex-1 rounded-xl border border-border bg-card/80 shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
                          {job.company}
                        </CardTitle>
                        <Badge variant="outline" className="border-border text-xs">
                          {job.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>
                          {job.start} – {job.end}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {job.summary ? (
                      <p className="mb-3 text-sm text-muted-foreground leading-relaxed sm:text-base">
                        {job.summary}
                      </p>
                    ) : null}
                    {Array.isArray(job.highlights) && job.highlights.length > 0 && (
                      <ul className="space-y-1 text-sm text-muted-foreground sm:text-base">
                        {job.highlights.map((item: string) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ExperienceSection
