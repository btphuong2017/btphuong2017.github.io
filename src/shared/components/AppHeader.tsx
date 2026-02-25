"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Container } from "./Container"

export function AppHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground">
            PB
          </div>
          <span className="font-semibold text-base sm:text-lg text-foreground">
            Portfolio
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a
              href="#home"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#experience"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Skills
            </a>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg hover:bg-muted hover:text-foreground"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        </nav>
      </Container>
    </header>
  )
}

export default AppHeader
