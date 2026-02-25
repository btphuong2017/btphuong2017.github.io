import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const messages = (
    await import(`../messages/${locale === "en" ? "en" : "vi"}.json`)
  ).default as IntlMessages

  return {
    locale,
    messages,
    timeZone: "Asia/Ho_Chi_Minh",
  }
})

type IntlMessages = Record<string, unknown>
