"use client"

import Image from "next/image"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
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
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home")}
            </a>
            <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("impact")}
            </a>
            <a
              href="#experience"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("experience")}
            </a>
            <a
              href="#projects"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("projects")}
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("about")}
            </a>
            <a
              href="#skills"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("skills")}
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contact")}
            </a>
          </div>

          <div className="flex items-center gap-2">
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
