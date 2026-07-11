import { localeRedirectScript, defaultLocalePath } from "@/lib/locale-redirect"

// Bare "/" (out/index.html). Client-side redirect so a returning visitor lands on
// their saved language; falls back to the default locale (and no-JS meta refresh).
export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: localeRedirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${defaultLocalePath}`} />
      </noscript>
    </>
  )
}
