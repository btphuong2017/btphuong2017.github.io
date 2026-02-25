import Image from "next/image"

import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import profile from "@/data/profile.json"

export function HeroSection() {
  return (
    <Section
      id="home"
      className="relative overflow-hidden bg-background"
    >
      <Container>
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-6 text-left">
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{profile.title}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Hello, I&apos;m
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  {profile.name}
                </h1>
              </div>

              <div className="space-y-4">
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2"
                >
                  <Mail className="size-4" />
                  <span>Get in touch</span>
                </a>
              </Button>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const el = document.getElementById("projects")
                  el?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
              >
                <span>View projects</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                  8+
                </p>
                <p className="text-sm text-muted-foreground">
                  Years of experience
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                  3+
                </p>
                <p className="text-sm text-muted-foreground">Teams led</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                  15+
                </p>
                <p className="text-sm text-muted-foreground">
                  Products and initiatives shipped
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm sm:h-64 sm:w-64 md:h-72 md:w-72">
              <Image
                src="/avatar.jpg"
                alt="Portrait of Phuong Bui Thanh"
                fill
                priority
                sizes="(min-width: 768px) 20rem, 16rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default HeroSection
