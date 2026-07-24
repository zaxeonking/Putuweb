import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;

  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin" && typeof payload.sub === "string";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  if (isProtectedRoute) {
    const authed = await isAuthenticated(request);
    if (!authed) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear any stale/invalid session cookie on the way out.
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  // Authenticated users hitting /login are sent straight to the dashboard.
  if (isLoginRoute) {
    const authed = await isAuthenticated(request);
    if (authed) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
