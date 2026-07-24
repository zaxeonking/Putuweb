import type { StudentStats, TeacherStats } from "@/lib/types";
import { ATTENDANCE_LABELS, ATTENDANCE_STYLES } from "./StatusPill";
import clsx from "clsx";

export default function StudentTeacherStats({
  studentStats,
  teacherStats,
}: {
  studentStats: StudentStats;
  teacherStats: TeacherStats;
}) {
  const todayEntries = Object.entries(studentStats.today) as [keyof typeof studentStats.today, number][];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Students</p>
        <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{studentStats.total}</p>
        <p className="mt-1 text-sm text-ink-500">
          {studentStats.active} active · {studentStats.inactive} inactive
        </p>
        <p className="mt-3 text-sm text-ink-600">
          Class average: <span className="font-semibold text-ink-900">{studentStats.averageGrade}%</span>
        </p>
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Today's attendance</p>
        <div className="mt-3 space-y-1.5">
          {todayEntries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between text-sm">
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  ATTENDANCE_STYLES[status]
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {ATTENDANCE_LABELS[status]}
              </span>
              <span className="font-semibold text-ink-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Teachers</p>
        <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{teacherStats.total}</p>
        <div className="mt-3 space-y-1 text-sm text-ink-600">
          {Object.entries(teacherStats.byDepartment).map(([dept, count]) => (
            <div key={dept} className="flex items-center justify-between">
              <span>{dept}</span>
              <span className="font-semibold text-ink-800">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
