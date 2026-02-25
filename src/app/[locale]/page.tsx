"use client"

import { HeroSection } from "@/features/home/HeroSection"
import { ExperienceSection } from "@/features/home/ExperienceSection"
import { ProjectsSection } from "@/features/home/ProjectsSection"
import { SkillsSection } from "@/features/home/SkillsSection"

export default function LocaleHomePage() {
  return (
    <>
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
    </>
  )
}
