"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface MembersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  attendanceFilter: string;
  onAttendanceFilterChange: (value: string) => void;
  totalCount: number;
  resultCount: number;
}

export function MembersFilterBar({
  search,
  onSearchChange,
  attendanceFilter,
  onAttendanceFilterChange,
  totalCount,
  resultCount,
}: MembersFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* search by name */}
        <div className="group relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-marigold dark:text-muted-dark"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search members by name"
            className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted hover:border-marigold/50 focus:border-marigold dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-muted-dark sm:w-64"
          />
        </div>

        {/* filter by attendance number */}
        <div className="group relative">
          <SlidersHorizontal
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-marigold dark:text-muted-dark"
          />
          <select
            value={attendanceFilter}
            onChange={(e) => onAttendanceFilterChange(e.target.value)}
            aria-label="Filter members by attendance number"
            className="w-full cursor-pointer appearance-none rounded-full border border-line bg-surface py-2.5 pl-10 pr-9 text-sm text-ink outline-none transition-colors hover:border-marigold/50 focus:border-marigold dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark sm:w-48"
          >
            <option value="all">All attendance no.</option>
            {Array.from({ length: totalCount }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                No. {String(n).padStart(2, "0")}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted dark:text-muted-dark">
            ▾
          </span>
        </div>
      </div>

      <p aria-live="polite" className="font-mono text-xs uppercase tracking-widest text-muted dark:text-muted-dark">
        Showing {resultCount} of {totalCount}
      </p>
    </div>
  );
}
