"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import Link from "next/link";
import type { Assignment, HomeworkStatus } from "@/lib/types";
import { formatDate } from "@/components/CategoryBadge";
import SubjectBadge from "./SubjectBadge";
import { IconCheckCircle } from "@/components/icons";

const STORAGE_KEY = "homework-tracker-overrides";

interface TrackerRow {
  assignment: Assignment;
  status: HomeworkStatus;
  submittedDate: string | null;
}

type Overrides = Record<string, { status: HomeworkStatus; submittedDate: string | null }>;

function loadOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeworkTracker({ initialRows }: { initialRows: TrackerRow[] }) {
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const rows = useMemo(
    () =>
      initialRows.map((row) => {
        const override = overrides[row.assignment.id];
        return override ? { ...row, status: override.status, submittedDate: override.submittedDate } : row;
      }),
    [initialRows, overrides]
  );

  const completedCount = rows.filter((r) => r.status === "completed").length;
  const progressPct = rows.length === 0 ? 0 : Math.round((completedCount / rows.length) * 100);

  function toggleComplete(row: TrackerRow) {
    const nextStatus: HomeworkStatus = row.status === "completed" ? "not-started" : "completed";
    const next: Overrides = {
      ...overrides,
      [row.assignment.id]: {
        status: nextStatus,
        submittedDate: nextStatus === "completed" ? todayIso() : null,
      },
    };
    setOverrides(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — state still updates for this session
    }
    toast.success(nextStatus === "completed" ? "Marked complete" : "Marked not started");
  }

  return (
    <div>
      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-800">
            {completedCount} of {rows.length} complete
          </span>
          <span className="text-ink-500">{progressPct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brass-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <li
            key={row.assignment.id}
            className={clsx(
              "flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between",
              row.status === "completed" ? "border-emerald-200" : "border-ink-100"
            )}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleComplete(row)}
                aria-pressed={row.status === "completed"}
                aria-label={`Mark ${row.assignment.title} as ${row.status === "completed" ? "not started" : "complete"}`}
                className={clsx(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  row.status === "completed"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-ink-300 text-transparent hover:border-ink-500"
                )}
              >
                <IconCheckCircle className="h-4 w-4" />
              </button>
              <div>
                <Link
                  href={`/resources/assignments/${row.assignment.id}`}
                  className="font-semibold text-ink-900 hover:text-brass-600"
                >
                  {row.assignment.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                  <SubjectBadge subject={row.assignment.subject} />
                  <span>Due {formatDate(row.assignment.dueDate)}</span>
                </div>
              </div>
            </div>

            <div className="text-sm sm:text-right">
              {row.status === "completed" ? (
                <span className="font-medium text-emerald-700">
                  Submitted {row.submittedDate ? formatDate(row.submittedDate) : ""}
                </span>
              ) : row.status === "in-progress" ? (
                <span className="font-medium text-brass-600">In progress</span>
              ) : (
                <span className="font-medium text-ink-400">Not started</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
