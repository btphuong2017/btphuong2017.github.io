// Middleware disabled for static export to avoid headers() usage during build.
// Re-enable for server/Node hosting if you need locale redirects.
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
