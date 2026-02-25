import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect to default locale (vi) as specified in site config
  redirect("/vi")
}
