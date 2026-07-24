import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getTeachers } from "@/lib/student-data";
import type { TeacherDepartment } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const department = request.nextUrl.searchParams.get("department") as TeacherDepartment | "All" | null;
  const teachers = await getTeachers(department ?? "All");
  return NextResponse.json(teachers);
}
