import clsx from "clsx";
import type { ResourceSubject } from "@/lib/types";

const SUBJECT_STYLES: Record<ResourceSubject, string> = {
  Math: "bg-blue-50 text-blue-700",
  Science: "bg-emerald-50 text-emerald-700",
  "English Language Arts": "bg-purple-50 text-purple-700",
  "Social Studies": "bg-brass-100 text-brass-700",
  Art: "bg-pink-50 text-pink-700",
  "Physical Education": "bg-orange-50 text-orange-700",
};

export default function SubjectBadge({ subject }: { subject: ResourceSubject }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        SUBJECT_STYLES[subject] ?? "bg-ink-100 text-ink-700"
      )}
    >
      {subject}
    </span>
  );
}
