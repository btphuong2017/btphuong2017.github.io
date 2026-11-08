import { pageMetadata } from "@/content/metadata"
import { defaultOrder } from "@/features/sections/order"
import { Page } from "@/features/sections/Page"
import type { Locale } from "@/i18n/routing"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return pageMetadata(locale)
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  return <Page locale={locale} order={defaultOrder} path="" />
}
