import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { authSecret } from "@/lib/env";

const protectedPrefix = "/app";
const guestOnlyRoutes = new Set(["/login", "/register"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: authSecret,
  });

  if (pathname.startsWith(protectedPrefix) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (guestOnlyRoutes.has(pathname) && token) {
    return NextResponse.redirect(new URL("/app/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
