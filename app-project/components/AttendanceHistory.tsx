import type { AttendanceRecord } from "@/lib/types";
import { AttendanceStatusPill } from "./StatusPill";
import { formatDate } from "./CategoryBadge";

export default function AttendanceHistory({ records }: { records: AttendanceRecord[] }) {
  if (records.length === 0) {
    return <p className="text-sm text-ink-500">No attendance has been recorded yet.</p>;
  }

  return (
    <ul className="divide-y divide-ink-100">
      {records.map((record) => (
        <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
          <span className="text-ink-700">{formatDate(record.date)}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400">
              Recorded {new Date(record.recordedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <AttendanceStatusPill status={record.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
