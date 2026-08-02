import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("bmt_token")?.value
  const { pathname, searchParams } = request.nextUrl

  // Allow OAuth callback redirects from Facebook (which carry code parameter) or connect-accounts page
  const isOAuthCallback = searchParams.has("code") || pathname.includes("/connect-accounts")

  if (!token && !isOAuthCallback && (pathname.startsWith("/workspace") || pathname === "/workspaces")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (token && pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = "/workspaces"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/workspace/:path*", "/workspaces", "/auth/:path*"],
}
