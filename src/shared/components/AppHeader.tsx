"use client"

import Image from "next/image"
import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "@/shared/context/I18nContext"
import { Button } from "@/components/ui/button"
import { Container } from "./Container"

export function AppHeader() {
  const t = useTranslations("nav")
  const { theme, setTheme } = useTheme()
  const pathname = usePathname() || "/vi"

  const currentLocale = pathname.startsWith("/en") ? "en" : "vi"
  const otherLocale = currentLocale === "en" ? "vi" : "en"
  const basePath = pathname.replace(/^\/(en|vi)/, "") || ""
  const otherHref = `/${otherLocale}${basePath}`

  // Highlight the current section in the header navigation
  const sectionIds = [
    "home",
    "impact",
    "experience",
    "projects",
    "about",
    "skills",
    "contact",
  ] as const
  const [activeSectionId, setActiveSectionId] = useState<
    (typeof sectionIds)[number]
  >("home")

  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 80
      const viewportCenter = window.scrollY + headerOffset + window.innerHeight / 3

      let currentSection: (typeof sectionIds)[number] = "home"

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const top = el.offsetTop
        const bottom = top + el.offsetHeight

        if (viewportCenter >= top && viewportCenter < bottom) {
          currentSection = id
          break
        }
      }

      setActiveSectionId(currentSection)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <a
          href={currentLocale === "en" ? "/en" : "/vi"}
          className="flex items-center gap-2"
        >
          <div className="relative h-8 w-8 sm:h-9 sm:w-9">
            <Image
              src="/logo_full.png"
              alt={t("portfolio")}
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-base sm:text-lg text-foreground">
            {t("portfolio")}
          </span>
        </a>

        <nav className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a
              href="#home"
              aria-current={activeSectionId === "home" ? "page" : undefined}
              className={
                activeSectionId === "home"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("home")}
            </a>
            <a
              href="#impact"
              aria-current={activeSectionId === "impact" ? "page" : undefined}
              className={
                activeSectionId === "impact"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("impact")}
            </a>
            <a
              href="#experience"
              aria-current={
                activeSectionId === "experience" ? "page" : undefined
              }
              className={
                activeSectionId === "experience"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("experience")}
            </a>
            <a
              href="#projects"
              aria-current={activeSectionId === "projects" ? "page" : undefined}
              className={
                activeSectionId === "projects"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("projects")}
            </a>
            <a
              href="#about"
              aria-current={activeSectionId === "about" ? "page" : undefined}
              className={
                activeSectionId === "about"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("about")}
            </a>
            <a
              href="#skills"
              aria-current={activeSectionId === "skills" ? "page" : undefined}
              className={
                activeSectionId === "skills"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("skills")}
            </a>
            <a
              href="#contact"
              aria-current={activeSectionId === "contact" ? "page" : undefined}
              className={
                activeSectionId === "contact"
                  ? "text-foreground font-medium transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {t("contact")}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <details className="relative md:hidden">
              <summary
                className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("home")}
              >
                <Menu className="size-5" />
              </summary>
              <div className="absolute right-0 top-11 z-50 min-w-44 rounded-lg border border-border bg-background p-2 shadow-sm">
                <nav className="flex flex-col gap-1 text-sm">
                  <a
                    href="#home"
                    aria-current={activeSectionId === "home" ? "page" : undefined}
                    className={
                      activeSectionId === "home"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("home")}
                  </a>
                  <a
                    href="#impact"
                    aria-current={
                      activeSectionId === "impact" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "impact"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("impact")}
                  </a>
                  <a
                    href="#experience"
                    aria-current={
                      activeSectionId === "experience" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "experience"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("experience")}
                  </a>
                  <a
                    href="#projects"
                    aria-current={
                      activeSectionId === "projects" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "projects"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("projects")}
                  </a>
                  <a
                    href="#about"
                    aria-current={
                      activeSectionId === "about" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "about"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("about")}
                  </a>
                  <a
                    href="#skills"
                    aria-current={
                      activeSectionId === "skills" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "skills"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("skills")}
                  </a>
                  <a
                    href="#contact"
                    aria-current={
                      activeSectionId === "contact" ? "page" : undefined
                    }
                    className={
                      activeSectionId === "contact"
                        ? "rounded-md px-2 py-1.5 text-foreground font-medium transition-colors"
                        : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    }
                  >
                    {t("contact")}
                  </a>
                </nav>
              </div>
            </details>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="px-2 text-xs font-medium"
            >
              <a href={otherHref}>{currentLocale === "en" ? "VI" : "EN"}</a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg hover:bg-muted hover:text-foreground"
              aria-label={t("themeToggle")}
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default AppHeader
