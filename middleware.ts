import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/playbook/subscribe")
  ) {
    return NextResponse.next();
  }

  // Allow all static files in the public folder
  if (pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  // Allowed pages
  const allowedRoutes = ["/playbook", "/check-email"];

  if (!allowedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/playbook", req.url));
  }

  return NextResponse.next();
}
