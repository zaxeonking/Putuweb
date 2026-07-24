import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from "@/lib/rate-limit";

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `login:${ip}`;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  const preCheck = checkRateLimit(clientKey);
  if (!preCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many attempts. Try again in ${preCheck.retryAfterSeconds}s.`,
      },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string; csrfToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { username, password, csrfToken } = body;

  if (!verifyCsrfToken(csrfToken)) {
    return NextResponse.json(
      { success: false, error: "Your session expired. Please refresh and try again." },
      { status: 403 }
    );
  }

  const result = validateCredentials(username ?? "", password ?? "");

  if (!result.valid) {
    const limitState = recordFailedAttempt(clientKey);
    const message = limitState.allowed
      ? result.error ?? "Invalid username or password."
      : `Too many attempts. Try again in ${limitState.retryAfterSeconds}s.`;
    return NextResponse.json(
      { success: false, error: message },
      { status: limitState.allowed ? 401 : 429 }
    );
  }

  clearRateLimit(clientKey);
  await createSession(username as string);

  return NextResponse.json({ success: true });
}
