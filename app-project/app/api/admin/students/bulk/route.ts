import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { bulkUpdateStudents } from "@/lib/student-data";
import type { BulkStudentAction } from "@/lib/types";

const VALID_ACTIONS: BulkStudentAction[] = [
  "mark-present",
  "mark-absent",
  "mark-late",
  "mark-excused",
  "activate",
  "deactivate",
];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { studentIds?: string[]; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { studentIds, action } = body;

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return NextResponse.json({ error: "studentIds must be a non-empty array." }, { status: 400 });
  }

  if (!action || !VALID_ACTIONS.includes(action as BulkStudentAction)) {
    return NextResponse.json({ error: "Unrecognized bulk action." }, { status: 400 });
  }

  const result = await bulkUpdateStudents(studentIds, action as BulkStudentAction, session.sub);
  return NextResponse.json(result);
}
