import { defaultLocalePath, localeRedirectScript } from "@/lib/locale-redirect"

/** Sends `/` and unknown paths to a locale home. See locale-redirect.ts. */
export function Redirect() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: localeRedirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${defaultLocalePath}`} />
      </noscript>
    </>
  )
}
