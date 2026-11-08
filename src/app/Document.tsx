import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

/*
 * Google splits each face into latin, latin-ext and vietnamese files, and latin-ext's range
 * overlaps vietnamese for ă đ ĩ ũ ơ ư ỳ ỹ, so any Vietnamese word (and the name, in both
 * locales) pulls latin-ext. Preload only what the name needs: Bricolage latin and latin-ext.
 * The vietnamese file and the text face come from the CSS, with metric-matched fallbacks.
 * ponytail: opsz forces the whole 200..800 wght range (120 kB for one weight); a self-hosted
 * static opsz 96 / wght 800 instance is about 37 kB, if the project ever leaves next/font/google.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-display",
})
const text = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext"],
  preload: false,
  weight: ["400", "600"],
  variable: "--font-text",
})

/** The <html> shell shared by the root layouts (each locale, the redirect, the 404). */
export function Document({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`}>
      <body>
        {/* Google Tag Manager (GTM) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8VQG3NP');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P8VQG3NP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
