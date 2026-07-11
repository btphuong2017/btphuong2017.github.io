import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect to default locale (en) as specified in site config
  redirect("/en")
}
