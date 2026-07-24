"use client";

import type { BulkStudentAction } from "@/lib/types";

const ACTIONS: { action: BulkStudentAction; label: string; confirm?: string }[] = [
  { action: "mark-present", label: "Mark present" },
  { action: "mark-absent", label: "Mark absent" },
  { action: "mark-late", label: "Mark late" },
  { action: "mark-excused", label: "Mark excused" },
  { action: "activate", label: "Activate" },
  {
    action: "deactivate",
    label: "Deactivate",
    confirm: "Deactivate the selected students? They'll be marked inactive.",
  },
];

export default function BulkActionBar({
  count,
  pending,
  onAction,
  onClear,
}: {
  count: number;
  pending: boolean;
  onAction: (action: BulkStudentAction) => void;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="sticky top-20 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-brass-200 bg-brass-50 px-4 py-3">
      <p className="text-sm font-semibold text-brass-800">
        {count} student{count === 1 ? "" : "s"} selected
      </p>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.action}
            type="button"
            disabled={pending}
            onClick={() => {
              if (a.confirm && !window.confirm(a.confirm)) return;
              onAction(a.action);
            }}
            className="rounded-md border border-brass-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-brass-700 hover:bg-brass-100 disabled:opacity-50"
          >
            {a.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-xs font-semibold text-ink-500 hover:text-ink-800"
      >
        Clear selection
      </button>
    </div>
  );
}
