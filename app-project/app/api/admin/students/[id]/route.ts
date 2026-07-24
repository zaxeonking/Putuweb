import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStudentFullProfile } from "@/lib/student-data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getStudentFullProfile(params.id);
  if (!profile) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  return NextResponse.json(profile);
}
