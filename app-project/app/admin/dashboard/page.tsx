import type { Metadata } from "next";
import Link from "next/link";
import { getStudentStats, getTeacherStats } from "@/lib/student-data";
import StudentTeacherStats from "@/components/StudentTeacherStats";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default async function AdminDashboardPage() {
  const [studentStats, teacherStats] = await Promise.all([getStudentStats(), getTeacherStats()]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Welcome</h2>
        <p className="mt-2 text-sm text-ink-500">
          A snapshot of today's roster. Jump into{" "}
          <Link href="/admin/students" className="font-semibold text-brass-600 hover:text-brass-700">
            Students
          </Link>{" "}
          to search, filter, and manage attendance, or check the{" "}
          <Link href="/admin/teachers" className="font-semibold text-brass-600 hover:text-brass-700">
            Teacher directory
          </Link>{" "}
          and{" "}
          <Link href="/admin/officers" className="font-semibold text-brass-600 hover:text-brass-700">
            Class Officers
          </Link>{" "}
          pages.
        </p>
      </div>

      <StudentTeacherStats studentStats={studentStats} teacherStats={teacherStats} />
    </div>
  );
}
