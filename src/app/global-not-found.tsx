import { baseMetadata } from "@/content/metadata"
import { routing } from "@/i18n/routing"
import { Document } from "./Document"
import { Redirect } from "./Redirect"

export const metadata = baseMetadata

// Exported to out/404.html for GitHub Pages. Any unknown path redirects to the
// visitor's locale home (see locale-redirect.ts) instead of a dead 404.
export default function GlobalNotFound() {
  return (
    <Document lang={routing.defaultLocale}>
      <Redirect />
    </Document>
  )
}
