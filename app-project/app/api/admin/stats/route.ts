import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStudentStats, getTeacherStats } from "@/lib/student-data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [students, teachers] = await Promise.all([getStudentStats(), getTeacherStats()]);
  return NextResponse.json({ students, teachers });
}
