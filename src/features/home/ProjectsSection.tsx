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
import profile from "@/data/profile.json"

export function ProjectsSection() {
  const t = useTranslations("projects")

  const featuredProjectSlug = "vela-logistics"
  const featuredProject = projects.find(
    (p) => (p as { slug?: string }).slug === featuredProjectSlug
  ) as (typeof projects)[number] | undefined
  const featuredProjectId = (featuredProject as { id?: string } | undefined)
    ?.id

  const featuredSlugValue = (featuredProject as { slug?: string } | undefined)
    ?.slug
  const featuredProblem = featuredSlugValue ? t(`${featuredSlugValue}.problem`) : null
  const featuredSolution = featuredSlugValue ? t(`${featuredSlugValue}.solution`) : null
  const featuredImpact = featuredSlugValue ? t(`${featuredSlugValue}.impact`) : null

  const featuredHasCase =
    featuredSlugValue &&
    featuredProblem &&
    featuredSolution &&
    featuredImpact &&
    featuredProblem !== `${featuredSlugValue}.problem` &&
    featuredSolution !== `${featuredSlugValue}.solution` &&
    featuredImpact !== `${featuredSlugValue}.impact`

  const otherProjects = featuredProjectId
    ? projects.filter((p) => p.id !== featuredProjectId)
    : projects

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

          <Card className="flex flex-col rounded-2xl border border-border bg-card/80 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span>{t("featuredLabel")}</span>
                </div>
                <div className="mb-0 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <Folder className="mr-2 size-4" />
                  <span>
                    {featuredSlugValue?.toString().toUpperCase() ?? "CASE STUDY"}
                  </span>
                </div>
              </div>

              <CardTitle className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
                {featuredProject?.title}
              </CardTitle>
              {(featuredProject as { role?: string } | undefined)?.role ? (
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {(featuredProject as { role?: string }).role}
                </p>
              ) : null}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              {featuredHasCase ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2 text-sm text-muted-foreground sm:text-base">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {t("problem")}
                    </p>
                    <p className="leading-relaxed">{featuredProblem}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground sm:text-base">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {t("solution")}
                    </p>
                    <p className="leading-relaxed">{featuredSolution}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground sm:text-base">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {t("impact")}
                    </p>
                    <p className="leading-relaxed">{featuredImpact}</p>
                  </div>
                </div>
              ) : (
                <>
                  {featuredProject?.summary ? (
                    <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
                      {featuredProject.summary}
                    </p>
                  ) : null}
                  {Array.isArray(featuredProject?.highlights) &&
                  featuredProject?.highlights?.length ? (
                    <ul className="space-y-1 text-sm text-muted-foreground sm:text-base">
                      {featuredProject.highlights.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}

              {featuredProject?.tech?.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t("tech")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredProject.tech.map((tech) => (
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

              {Array.isArray(
                (featuredProject as { metrics?: string[] } | undefined)?.metrics
              ) &&
              (featuredProject as { metrics?: string[] }).metrics?.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Key outcomes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(featuredProject as { metrics?: string[] }).metrics!.map(
                      (m) => (
                        <Badge
                          key={m}
                          variant="outline"
                          className="border-border bg-background/60 text-xs font-normal text-muted-foreground"
                        >
                          {m}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              ) : null}

              {featuredProject?.duration ? (
                <p className="text-xs text-muted-foreground">{featuredProject.duration}</p>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {featuredProject?.repo ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <a
                      href={featuredProject.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-1.5 size-3.5" />
                      {t("code")}
                    </a>
                  </Button>
                ) : null}

                {featuredProject?.url ? (
                  <Button size="sm" asChild className="text-xs">
                    <a
                      href={featuredProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1.5 size-3.5" />
                      {t("live")}
                    </a>
                  </Button>
                ) : null}

                {!featuredProject?.repo && !featuredProject?.url ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <a
                        href={profile.links?.github ?? "https://github.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-1.5 size-3.5" />
                        {t("githubProfile")}
                      </a>
                    </Button>
                    <Button size="sm" asChild className="text-xs">
                      <a
                        href={`mailto:${profile.email}?subject=${encodeURIComponent(
                          `Request case study: ${featuredProject?.title ?? ""}`
                        )}`}
                      >
                        <ExternalLink className="mr-1.5 size-3.5" />
                        {t("requestCaseStudy")}
                      </a>
                    </Button>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => {
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

                  {Array.isArray((project as { metrics?: string[] }).metrics) &&
                  (project as { metrics?: string[] }).metrics?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(project as { metrics?: string[] }).metrics!.map((m) => (
                        <Badge
                          key={m}
                          variant="outline"
                          className="border-border bg-background/60 text-xs font-normal text-muted-foreground"
                        >
                          {m}
                        </Badge>
                      ))}
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
                      {!project.repo && !project.url && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a
                              href={profile.links?.github ?? "https://github.com"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="mr-1.5 size-3.5" />
                              {t("githubProfile")}
                            </a>
                          </Button>
                          <Button size="sm" asChild className="text-xs">
                            <a
                              href={`mailto:${profile.email}?subject=${encodeURIComponent(
                                `Request case study: ${project.title}`
                              )}`}
                            >
                              <ExternalLink className="mr-1.5 size-3.5" />
                              {t("requestCaseStudy")}
                            </a>
                          </Button>
                        </>
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

