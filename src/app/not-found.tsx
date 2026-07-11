import { localeRedirectScript, defaultLocalePath } from "@/lib/locale-redirect"

// Exported to out/404.html for GitHub Pages. Any unknown path redirects to the
// visitor's locale home (see locale-redirect.ts) instead of a dead 404.
export default function NotFound() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: localeRedirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${defaultLocalePath}`} />
      </noscript>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
          padding: "48px 28px",
        }}
      >
        Redirecting…
      </p>
    </>
  )
}
