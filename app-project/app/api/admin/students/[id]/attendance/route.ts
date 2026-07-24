import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setAttendanceStatus } from "@/lib/student-data";
import type { AttendanceStatus } from "@/lib/types";

const VALID_STATUSES: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as AttendanceStatus)) {
    return NextResponse.json({ error: "status must be one of present/absent/late/excused." }, { status: 400 });
  }

  const record = await setAttendanceStatus(params.id, body.status as AttendanceStatus, session.sub);
  if (!record) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  return NextResponse.json(record);
}
