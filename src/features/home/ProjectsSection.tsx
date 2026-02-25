import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { ContentCard } from "@/shared/components/ContentCard"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tag } from "@/shared/components/Tag"
import { Github, ExternalLink, Folder } from "lucide-react"
import projects from "@/data/projects.json"

export function ProjectsSection() {
  return (
    <Section id="projects">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            icon={<Folder className="size-3" />}
            label="Selected projects"
            title="Work that reflects how I build"
            description="A curated set of products and initiatives, with emphasis on impact, collaboration, and frontend architecture."
            align="center"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ContentCard key={project.id} className="flex h-full flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
                    {project.title}
                  </CardTitle>
                  {project.role ? (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {project.role}
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  {project.summary ? (
                    <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
                      {project.summary}
                    </p>
                  ) : null}
                  {Array.isArray(project.highlights) &&
                    project.highlights.length > 0 && (
                      <ul className="space-y-1 text-sm text-muted-foreground sm:text-base">
                        {project.highlights.map((item: string) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                  {project.tech?.length ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Tech
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <Tag key={tech}>{tech}</Tag>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {project.duration ? (
                    <p className="text-xs text-muted-foreground">
                      {project.duration}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {project.repo && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="mr-1.5 size-3.5" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.url && (
                      <Button size="sm" asChild className="text-xs">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1.5 size-3.5" />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </ContentCard>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ProjectsSection

