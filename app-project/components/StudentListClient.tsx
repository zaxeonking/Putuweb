"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { AttendanceStatusOrUnrecorded, BulkStudentAction, StudentListResult } from "@/lib/types";
import Avatar from "./Avatar";
import { EnrollmentStatusPill } from "./StatusPill";
import AttendanceToggle from "./AttendanceToggle";
import Pagination from "./Pagination";
import BulkActionBar from "./BulkActionBar";
import ExportStudentsButton from "./ExportStudentsButton";
import EmptyState from "./EmptyState";
import { CardSkeletonGrid } from "./Skeleton";
import { IconSearch, IconUsers } from "./icons";

const ATTENDANCE_FILTERS: { value: AttendanceStatusOrUnrecorded | "All"; label: string }[] = [
  { value: "All", label: "All statuses" },
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
  { value: "unrecorded", label: "Not recorded" },
];

export default function StudentListClient({ sections }: { sections: string[] }) {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [section, setSection] = useState("All");
  const [status, setStatus] = useState<AttendanceStatusOrUnrecorded | "All">("All");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<StudentListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkPending, setBulkPending] = useState(false);

  // Debounce the free-text search so we're not firing a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timeout);
  }, [q]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, section, status]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (section !== "All") params.set("section", section);
    if (status !== "All") params.set("status", status);
    params.set("page", String(page));
    return params.toString();
  }, [debouncedQ, section, status, page]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/admin/students?${queryString}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((result: StudentListResult) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load the student list.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!data) return;
    setSelectedIds((prev) => {
      const allSelected = data.items.every((s) => prev.has(s.id));
      if (allSelected) return new Set();
      return new Set(data.items.map((s) => s.id));
    });
  }

  async function handleBulkAction(action: BulkStudentAction) {
    setBulkPending(true);
    try {
      const response = await fetch("/api/admin/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: Array.from(selectedIds), action }),
      });
      if (!response.ok) throw new Error("Bulk update failed");
      const result = await response.json();
      toast.success(`Updated ${result.updated} student${result.updated === 1 ? "" : "s"}.`);
      setSelectedIds(new Set());
      // Refetch current page to reflect changes.
      const res = await fetch(`/api/admin/students?${queryString}`);
      if (res.ok) setData(await res.json());
    } catch {
      toast.error("Couldn't complete the bulk action.");
    } finally {
      setBulkPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or student ID…"
            className="w-full rounded-md border border-ink-200 py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brass-400 focus:outline-none"
          />
        </div>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-700 focus:border-brass-400 focus:outline-none"
        >
          <option value="All">All sections</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AttendanceStatusOrUnrecorded | "All")}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-700 focus:border-brass-400 focus:outline-none"
        >
          {ATTENDANCE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <ExportStudentsButton query={queryString.replace(/&?page=\d+/, "")} />
      </div>

      <BulkActionBar
        count={selectedIds.size}
        pending={bulkPending}
        onAction={handleBulkAction}
        onClear={() => setSelectedIds(new Set())}
      />

      {loading ? (
        <CardSkeletonGrid count={4} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={<IconUsers className="h-10 w-10" />}
          title="No students match these filters"
          message="Try a different search term or clear the class section / attendance filters."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-ink-100 bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={data.items.length > 0 && data.items.every((s) => selectedIds.has(s.id))}
                      onChange={toggleSelectAll}
                      aria-label="Select all students on this page"
                    />
                  </th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Attendance today</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.items.map((student) => (
                  <tr key={student.id} className="align-middle hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(student.id)}
                        onChange={() => toggleSelected(student.id)}
                        aria-label={`Select ${student.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/students/${student.id}`} className="flex items-center gap-3 group">
                        <Avatar name={student.name} photoUrl={student.photoUrl} size="sm" />
                        <div>
                          <p className="font-medium text-ink-900 group-hover:text-brass-600">{student.name}</p>
                          <p className="text-xs text-ink-400">{student.studentId}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{student.classSection}</td>
                    <td className="px-4 py-3 text-ink-600">
                      <p>{student.guardianName}</p>
                      <p className="text-xs text-ink-400">{student.contactEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceToggle studentId={student.id} initialStatus={student.todayStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <EnrollmentStatusPill status={student.enrollmentStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-xs font-semibold text-brass-600 hover:text-brass-700"
                      >
                        View profile →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-ink-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-500">
              Showing {(data.page - 1) * data.pageSize + 1}–
              {Math.min(data.page * data.pageSize, data.total)} of {data.total} students
            </p>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
