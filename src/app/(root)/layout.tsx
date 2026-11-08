import type { ReactNode } from "react"
import { baseMetadata } from "@/content/metadata"
import { routing } from "@/i18n/routing"
import { Document } from "../Document"

export const metadata = baseMetadata

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Document lang={routing.defaultLocale}>{children}</Document>
}
