"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Announcement } from "@/lib/types";
import CategoryBadge, { formatDate } from "./CategoryBadge";
import { IconChevronDown } from "./icons";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={clsx(
        "rounded-xl border bg-white p-5 shadow-card transition-colors",
        announcement.pinned ? "border-brass-300" : "border-ink-100"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`announcement-${announcement.id}`}
        className="flex w-full flex-col items-start gap-3 text-left"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CategoryBadge category={announcement.category} />
            {announcement.pinned && (
              <span className="text-xs font-semibold uppercase tracking-wide text-brass-600">
                Pinned
              </span>
            )}
          </div>
          <IconChevronDown
            className={clsx(
              "h-5 w-5 flex-shrink-0 text-ink-400 transition-transform duration-300",
              isOpen && "rotate-180 text-brass-600"
            )}
          />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{announcement.title}</p>
          <p className="mt-1 text-sm text-ink-500">{formatDate(announcement.date)}</p>
        </div>
        <p className="text-sm text-ink-600">{announcement.summary}</p>
      </button>

      <div
        id={`announcement-${announcement.id}`}
        className={clsx(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="mt-4 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-700">
            {announcement.body}
          </p>
        </div>
      </div>
    </div>
  );
}
