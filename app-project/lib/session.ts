import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "admin_session";

const alg = "HS256";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a long random value in your environment."
    );
  }
  return new TextEncoder().encode(secret);
}

function getMaxAgeSeconds() {
  const minutes = Number(process.env.SESSION_MAX_AGE_MINUTES ?? 30);
  const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
  return safeMinutes * 60;
}

export interface SessionPayload {
  sub: string; // admin username
  role: "admin";
}

/**
 * Creates a signed, httpOnly session cookie for the given admin user.
 * Sliding expiration: every verified request should call refreshSession
 * so inactivity (not just elapsed time) drives expiry.
 */
export async function createSession(username: string) {
  const maxAgeSeconds = getMaxAgeSeconds();
  const token = await new SignJWT({ sub: username, role: "admin" } satisfies SessionPayload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function destroySession() {
  cookies().delete(SESSION_COOKIE_NAME);
}

/**
 * Verifies a raw token string (used in middleware, where next/headers
 * cookies() write API isn't available on the request).
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return { sub: payload.sub, role: "admin" };
  } catch {
    return null;
  }
}

/** Reads and verifies the session from the current request (server components/route handlers). */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
