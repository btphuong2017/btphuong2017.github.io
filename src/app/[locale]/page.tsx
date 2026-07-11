import { HeroSection } from "@/features/home/HeroSection"
import { MetricsStrip } from "@/features/home/MetricsStrip"
import { WorkSection } from "@/features/home/WorkSection"
import { ExperienceSection } from "@/features/home/ExperienceSection"
import { SkillsSection } from "@/features/home/SkillsSection"
import { ContactSection } from "@/features/home/ContactSection"

export default function LocaleHomePage() {
  return (
    <>
      <HeroSection />
      <MetricsStrip />
      <WorkSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
