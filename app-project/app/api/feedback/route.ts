import { NextRequest, NextResponse } from "next/server";
import { checkSubmissionLimit } from "@/lib/rate-limit";
import type { FeedbackPayload } from "@/lib/types";

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `feedback:${ip}`;
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

  let body: FeedbackPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { rating, comment, name, honeypot } = body;

  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, error: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }

  if (!comment?.trim()) {
    return NextResponse.json(
      { success: false, error: "Please add a short comment." },
      { status: 400 }
    );
  }

  // Mock persistence layer — swap for a database write once the content
  // module exists. This is also the hook point for the notification system,
  // which should alert admins whenever a new submission lands here.
  console.log("[feedback:submission]", {
    rating,
    comment: comment.trim(),
    name: name?.trim() || "Anonymous",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
