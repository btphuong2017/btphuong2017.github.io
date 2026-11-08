import { notFound } from "next/navigation"
import { pageMetadata } from "@/content/metadata"
import { isReader, readerOrder, readers } from "@/features/sections/order"
import { Page } from "@/features/sections/Page"
import type { Locale } from "@/i18n/routing"

export const dynamicParams = false

export function generateStaticParams() {
  return readers.map((reader) => ({ reader }))
}

type Props = { params: Promise<{ locale: Locale; reader: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return pageMetadata(locale, { noindex: true })
}

// Not linked from the nav: the owner sends these links to a specific reader.
export default async function ReaderPage({ params }: Props) {
  const { locale, reader } = await params
  if (!isReader(reader)) notFound()
  return <Page locale={locale} order={readerOrder[reader]} path={`for/${reader}/`} />
}
