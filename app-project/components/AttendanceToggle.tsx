"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import type { AttendanceStatus, AttendanceStatusOrUnrecorded } from "@/lib/types";

const OPTIONS: { status: AttendanceStatus; label: string; short: string; activeClass: string }[] = [
  { status: "present", label: "Present", short: "P", activeClass: "bg-emerald-600 text-white" },
  { status: "late", label: "Late", short: "L", activeClass: "bg-brass-500 text-white" },
  { status: "absent", label: "Absent", short: "A", activeClass: "bg-red-600 text-white" },
  { status: "excused", label: "Excused", short: "E", activeClass: "bg-blue-600 text-white" },
];

export default function AttendanceToggle({
  studentId,
  initialStatus,
  onChanged,
}: {
  studentId: string;
  initialStatus: AttendanceStatusOrUnrecorded;
  onChanged?: (status: AttendanceStatus) => void;
}) {
  const [status, setStatus] = useState<AttendanceStatusOrUnrecorded>(initialStatus);
  const [pending, setPending] = useState(false);

  async function handleSelect(next: AttendanceStatus) {
    if (next === status || pending) return;
    const previous = status;
    setPending(true);
    setStatus(next);

    try {
      const response = await fetch(`/api/admin/students/${studentId}/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) throw new Error("Request failed");
      toast.success(`Marked ${next}.`);
      onChanged?.(next);
    } catch {
      setStatus(previous);
      toast.error("Couldn't update attendance. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="inline-flex overflow-hidden rounded-md border border-ink-200"
      role="group"
      aria-label="Set today's attendance status"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.status}
          type="button"
          disabled={pending}
          title={opt.label}
          onClick={() => handleSelect(opt.status)}
          className={clsx(
            "px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60",
            status === opt.status ? opt.activeClass : "bg-white text-ink-500 hover:bg-ink-50"
          )}
        >
          {opt.short}
        </button>
      ))}
    </div>
  );
}
