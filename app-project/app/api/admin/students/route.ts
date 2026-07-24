import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStudentList } from "@/lib/student-data";
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
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 8);

  const result = await getStudentList({
    q,
    section,
    attendanceStatus: status,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 8,
  });

  return NextResponse.json(result);
}
