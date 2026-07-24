import "server-only";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE_NAME = "csrf_token";

/**
 * Double-submit cookie CSRF protection.
 * The token is generated server-side, stored in an httpOnly cookie, and
 * rendered into a hidden form field on the same response. A same-origin
 * form submission will echo the field back; cross-site requests cannot
 * read the httpOnly cookie to forge a matching field.
 */
export function issueCsrfToken(): string {
  const token = randomBytes(32).toString("hex");
  cookies().set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes, plenty for filling out a login form
  });
  return token;
}

export function verifyCsrfToken(submittedToken: string | undefined | null): boolean {
  const cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken || !submittedToken) return false;
  if (cookieToken.length !== submittedToken.length) return false;
  // Constant-time-ish comparison to avoid trivial timing leaks.
  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ submittedToken.charCodeAt(i);
  }
  return mismatch === 0;
}
