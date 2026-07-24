import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentFullProfile } from "@/lib/student-data";
import Avatar from "@/components/Avatar";
import { EnrollmentStatusPill } from "@/components/StatusPill";
import AttendanceToggle from "@/components/AttendanceToggle";
import AttendanceHistory from "@/components/AttendanceHistory";
import AchievementBadgeGrid from "@/components/AchievementBadgeGrid";
import ProgressChart from "@/components/ProgressChart";
import { IconChevronLeft } from "@/components/icons";
import { formatDate } from "@/components/CategoryBadge";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const profile = await getStudentFullProfile(params.id);
  return { title: profile ? `${profile.student.name} | Admin` : "Student | Admin" };
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const profile = await getStudentFullProfile(params.id);
  if (!profile) notFound();

  const { student, todayStatus, attendance, attendanceRate, achievements, progress } = profile;

  const subjects = Array.from(new Set(progress.map((p) => p.subject)));

  return (
    <div className="space-y-6">
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <IconChevronLeft className="h-4 w-4" />
        Back to students
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-ink-100 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} photoUrl={student.photoUrl} size="lg" />
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">{student.name}</h2>
            <p className="text-sm text-ink-500">
              {student.studentId} · {student.classSection}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <EnrollmentStatusPill status={student.enrollmentStatus} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Today's attendance</p>
          <AttendanceToggle studentId={student.id} initialStatus={todayStatus} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Personal info */}
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <h3 className="font-display text-base font-semibold text-ink-900">Personal Information</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Date of birth</dt>
              <dd className="text-ink-800">{formatDate(student.dateOfBirth)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Guardian</dt>
              <dd className="text-ink-800">{student.guardianName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Contact email</dt>
              <dd>
                <a href={`mailto:${student.contactEmail}`} className="text-brass-600 hover:text-brass-700">
                  {student.contactEmail}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Contact phone</dt>
              <dd className="text-ink-800">{student.contactPhone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Enrolled since</dt>
              <dd className="text-ink-800">{formatDate(student.enrollmentDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Grade average</dt>
              <dd className="text-ink-800">{student.gradeAverage}%</dd>
            </div>
          </dl>
          {student.notes && (
            <p className="mt-3 rounded-md bg-ink-50 p-3 text-xs text-ink-500">{student.notes}</p>
          )}
        </div>

        {/* Attendance summary */}
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-900">Attendance Record</h3>
            <span className="text-sm font-semibold text-ink-800">{attendanceRate}% present</span>
          </div>
          <div className="mt-2 max-h-72 overflow-y-auto">
            <AttendanceHistory records={attendance} />
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink-900">Achievements</h3>
          <div className="mt-3">
            <AchievementBadgeGrid achievements={achievements} />
          </div>
        </div>

        {/* Progress monitoring */}
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink-900">Progress Monitoring</h3>
          <p className="mt-1 text-sm text-ink-500">Score trend by subject across this year's terms.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {subjects.map((subject) => (
              <ProgressChart
                key={subject}
                subject={subject}
                data={progress
                  .filter((p) => p.subject === subject)
                  .map((p) => ({ period: p.period, score: p.score }))}
              />
            ))}
          </div>
        </div>

        {/* Schedule placeholder — Schedule module integration point */}
        <div className="rounded-xl border border-dashed border-ink-200 bg-white p-5 lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink-900">Schedule</h3>
          <p className="mt-1 text-sm text-ink-500">
            This section will show {student.name.split(" ")[0]}'s individual class schedule once the
            Schedule module is built.
          </p>
        </div>
      </div>
    </div>
  );
}
