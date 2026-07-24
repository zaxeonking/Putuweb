import clsx from "clsx";
import type { AnnouncementCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<AnnouncementCategory, string> = {
  General: "bg-ink-100 text-ink-700",
  Academic: "bg-blue-50 text-blue-700",
  Event: "bg-brass-100 text-brass-700",
  Urgent: "bg-red-50 text-red-700",
  Celebration: "bg-emerald-50 text-emerald-700",
};

export default function CategoryBadge({ category }: { category: AnnouncementCategory }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        CATEGORY_STYLES[category] ?? "bg-ink-100 text-ink-700"
      )}
    >
      {category}
    </span>
  );
}

export function formatDate(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
