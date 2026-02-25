import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Container } from "./Container"
import profile from "@/data/profile.json"

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="space-y-8 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  PB
                </div>
                <span className="text-sm font-semibold text-foreground sm:text-base">
                  {profile.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Senior Frontend Developer &amp; Team Lead
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Navigation
              </h4>
              <nav className="flex flex-col gap-1.5 text-sm">
                <a
                  href="#home"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </a>
                <a
                  href="#experience"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Experience
                </a>
                <a
                  href="#projects"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Projects
                </a>
                <a
                  href="#skills"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skills
                </a>
              </nav>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Contact
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Mail className="size-4" />
                  <span>{profile.email}</span>
                </a>
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Phone className="size-4" />
                  <span>{profile.phone}</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p className="text-center md:text-left">
              © {currentYear} {profile.name}. All rights reserved.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send email"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default AppFooter
