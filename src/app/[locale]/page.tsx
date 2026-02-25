import { HeroSection } from "@/features/home/HeroSection"
import { ImpactHighlightsSection } from "@/features/home/ImpactHighlightsSection"
import { ExperienceSection } from "@/features/home/ExperienceSection"
import { ProjectsSection } from "@/features/home/ProjectsSection"
import { AboutSection } from "@/features/home/AboutSection"
import { SkillsSection } from "@/features/home/SkillsSection"
import { ContactSection } from "@/features/home/ContactSection"

export default function LocaleHomePage() {
  return (
    <>
      <HeroSection />
      <ImpactHighlightsSection />
      <ExperienceSection />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
