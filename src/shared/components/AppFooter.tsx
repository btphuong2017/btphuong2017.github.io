"use client"

import { useTranslations } from "@/shared/context/I18nContext"

export function AppFooter() {
  const t = useTranslations("footer")

  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>{t("copyright")}</span>
        <span>{t("note")}</span>
      </div>
    </footer>
  )
}

export default AppFooter
