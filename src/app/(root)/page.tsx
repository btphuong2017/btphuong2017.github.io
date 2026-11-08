import { pageMetadata } from "@/content/metadata"
import { routing } from "@/i18n/routing"
import { Redirect } from "../Redirect"

// Bare "/" redirects, but a shared link to it still needs a description and a card.
export const metadata = pageMetadata(routing.defaultLocale)

// Bare "/" (out/index.html): lands a returning visitor on their saved language.
export default function RootPage() {
  return <Redirect />
}
