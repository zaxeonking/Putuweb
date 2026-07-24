"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Assignment, ResourceSubject } from "@/lib/types";
import { getAssignmentDaysUntilDue } from "@/lib/resources-data-client";
import AssignmentCard from "./AssignmentCard";
import EmptyState from "@/components/EmptyState";
import { IconClipboardCheck } from "@/components/icons";

type DueFilter = "all" | "upcoming" | "past-due";

export default function AssignmentsBrowser({
  assignments,
  subjects,
}: {
  assignments: Assignment[];
  subjects: ResourceSubject[];
}) {
  const [subject, setSubject] = useState<ResourceSubject | "all">("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");

  const withDays = useMemo(
    () => assignments.map((a) => ({ assignment: a, daysLeft: getAssignmentDaysUntilDue(a.dueDate) })),
    [assignments]
  );

  const filtered = withDays.filter(({ assignment, daysLeft }) => {
    if (subject !== "all" && assignment.subject !== subject) return false;
    if (dueFilter === "upcoming" && daysLeft < 0) return false;
    if (dueFilter === "past-due" && daysLeft >= 0) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as ResourceSubject | "all")}
          className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700"
          aria-label="Filter by subject"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="inline-flex overflow-hidden rounded-md border border-ink-200" role="group" aria-label="Filter by due date">
          {(
            [
              { value: "all", label: "All" },
              { value: "upcoming", label: "Upcoming" },
              { value: "past-due", label: "Past due" },
            ] as { value: DueFilter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDueFilter(opt.value)}
              className={clsx(
                "px-3 py-2 text-sm font-medium transition-colors",
                dueFilter === opt.value ? "bg-ink-900 text-ink-50" : "bg-white text-ink-600 hover:bg-ink-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-sm text-ink-400">
          {filtered.length} assignment{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconClipboardCheck className="h-10 w-10" />}
            title="No assignments match those filters"
            message="Try a different subject or due-date range."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ assignment, daysLeft }) => (
              <AssignmentCard key={assignment.id} assignment={assignment} daysLeft={daysLeft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
