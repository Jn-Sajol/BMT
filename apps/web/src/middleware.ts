import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("bmt_token")?.value
  const { pathname } = request.nextUrl

  if (!token && (pathname.startsWith("/workspace") || pathname === "/workspaces")) {
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
