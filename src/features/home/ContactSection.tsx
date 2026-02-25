"use client"

import { Mail, FileDown } from "lucide-react"
import { useTranslations } from "@/shared/context/I18nContext"
import { Section } from "@/shared/components/Section"
import { Container } from "@/shared/components/Container"
import { Button } from "@/components/ui/button"
import profile from "@/data/profile.json"

const CV_PATH = "/CV - Phuong Bui Thanh.pdf"

export function ContactSection() {
  const t = useTranslations("contact")

  return (
    <Section id="contact">
      <Container>
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2"
              >
                <Mail className="size-4" />
                <span>{t("cta")}</span>
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href={CV_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <FileDown className="size-4" />
                <span>{t("downloadCv")}</span>
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ContactSection
