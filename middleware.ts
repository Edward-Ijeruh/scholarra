import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/playbook/subscribe")
  ) {
    return NextResponse.next();
  }

  // Allowed routes
  const allowedRoutes = ["/playbook", "/check-email"];

  if (!allowedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/playbook", req.url));
  }

  return NextResponse.next();
}
