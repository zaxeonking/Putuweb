import { NextRequest, NextResponse } from "next/server";
import { checkSubmissionLimit } from "@/lib/rate-limit";
import type { ContactPayload } from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `contact:${ip}`;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  const limit = checkSubmissionLimit(clientKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many submissions. Try again in ${limit.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, subject, message, honeypot } = body;

  // Silently "succeed" on bot submissions caught by the honeypot field.
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { success: false, error: "All fields are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (message.trim().length < 10) {
    return NextResponse.json(
      { success: false, error: "Message is too short." },
      { status: 400 }
    );
  }

  // Mock persistence layer — swap this for a database write / email send /
  // notification-system trigger once those modules exist.
  console.log("[contact:submission]", {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
