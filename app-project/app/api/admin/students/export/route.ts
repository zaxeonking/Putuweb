import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStudentList, studentsToCsv } from "@/lib/student-data";
import type { AttendanceStatusOrUnrecorded } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const section = searchParams.get("section") ?? "All";
  const status = (searchParams.get("status") as AttendanceStatusOrUnrecorded | "All") ?? "All";

  // Export ignores pagination — it always covers every student matching the filters.
  const { items } = await getStudentList({ q, section, attendanceStatus: status, page: 1, pageSize: 10_000 });
  const csv = studentsToCsv(items);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="students-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
