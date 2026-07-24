"use client";

import clsx from "clsx";
import { IconChevronLeft, IconChevronRight } from "./icons";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 disabled:opacity-30"
        aria-label="Previous page"
      >
        <IconChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-sm text-ink-400">…</span>}
            <button
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={clsx(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium",
                p === page ? "bg-ink-900 text-ink-50" : "text-ink-700 hover:bg-ink-100"
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 disabled:opacity-30"
        aria-label="Next page"
      >
        <IconChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
