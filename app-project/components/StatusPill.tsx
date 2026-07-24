import clsx from "clsx";
import type { AttendanceStatusOrUnrecorded, EnrollmentStatus } from "@/lib/types";

export const ATTENDANCE_STYLES: Record<AttendanceStatusOrUnrecorded, string> = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-700",
  late: "bg-brass-100 text-brass-700",
  excused: "bg-blue-50 text-blue-700",
  unrecorded: "bg-ink-100 text-ink-500",
};

export const ATTENDANCE_LABELS: Record<AttendanceStatusOrUnrecorded, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
  unrecorded: "Not recorded",
};

export function AttendanceStatusPill({ status }: { status: AttendanceStatusOrUnrecorded }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        ATTENDANCE_STYLES[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ATTENDANCE_LABELS[status]}
    </span>
  );
}

export function EnrollmentStatusPill({ status }: { status: EnrollmentStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"
      )}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}
