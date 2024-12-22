import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import { getCurrentSession } from "./lib/session"

const protectedRoutes = ["/dashboard", "/dashboard/stories"]
const publicRoutes = ["/login", "/signup"]

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse> {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  if (request.method === "GET") {
    const response = NextResponse.next()
    const token = request.cookies.get("session")?.value ?? null

    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
    }

    const result = await getCurrentSession()
    if (isProtectedRoute && result.session === null) {
      return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    if (
      isPublicRoute &&
      result.session?.userId &&
      !request.nextUrl.pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
    }

    return response
  }

  const originHeader = request.headers.get("Origin")
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host")
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  let origin: URL
  try {
    origin = new URL(originHeader)
  } catch {
    return new NextResponse(null, {
      status: 403,
    })
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
