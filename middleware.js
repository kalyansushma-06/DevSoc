import { NextResponse } from "next/server";

// Lightweight edge check: just looks for the session cookie's presence.
// The real signature/expiry check happens server-side via lib/auth.js on
// every admin page and API route, so a forged cookie still gets rejected
// there - this middleware only avoids flashing protected pages.
const COOKIE_NAME = "devsoc_admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has(COOKIE_NAME);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
