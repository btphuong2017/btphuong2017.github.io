"use client"

import { useTranslations } from "@/shared/context/I18nContext"

import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, Folder } from "lucide-react"
import projects from "@/data/projects.json"

export function ProjectsSection() {
  const t = useTranslations("projects")

  return (
    <Section id="projects">
      <Container>
        <div className="space-y-10">
          <SectionHeader
            icon={<Folder className="size-3" />}
            label={t("label")}
            title={t("title")}
            description={t("description")}
            align="center"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const slug = (project as { slug?: string }).slug
              const problem = slug ? t(`${slug}.problem`) : null
              const solution = slug ? t(`${slug}.solution`) : null
              const impact = slug ? t(`${slug}.impact`) : null
              const hasCase =
                problem &&
                solution &&
                impact &&
                problem !== `${slug}.problem` &&
                solution !== `${slug}.solution` &&
                impact !== `${slug}.impact`

              return (
                <Card
                  key={project.id}
                  className="flex h-full flex-col rounded-xl border border-border bg-card/80 shadow-none"
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3 h-24 rounded-lg bg-muted/50 flex items-center justify-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <Folder className="mr-2 size-4" />
                      <span>
                        {(project as { slug?: string }).slug
                          ?.toString()
                          .toUpperCase() ?? "CASE STUDY"}
                      </span>
                    </div>
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
                    {hasCase ? (
                      <div className="space-y-3 text-sm text-muted-foreground sm:text-base">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                            {t("problem")}
                          </p>
                          <p className="leading-relaxed">{problem}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                            {t("solution")}
                          </p>
                          <p className="leading-relaxed">{solution}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                            {t("impact")}
                          </p>
                          <p className="leading-relaxed">{impact}</p>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}

                    {project.tech?.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {t("tech")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="border-border bg-background/60 text-xs font-normal text-muted-foreground"
                            >
                              {tech}
                            </Badge>
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
                            {t("code")}
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
                            {t("live")}
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ProjectsSection

