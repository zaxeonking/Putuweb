import Link from "next/link";
import clsx from "clsx";
import type { Assignment } from "@/lib/types";
import { formatDate } from "@/components/CategoryBadge";
import { IconClock, IconFileText } from "@/components/icons";
import SubjectBadge from "./SubjectBadge";

function countdownLabel(daysLeft: number): { text: string; tone: string } {
  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return { text: `${overdue} day${overdue === 1 ? "" : "s"} past due`, tone: "text-red-600" };
  }
  if (daysLeft === 0) return { text: "Due today", tone: "text-brass-700" };
  if (daysLeft === 1) return { text: "Due tomorrow", tone: "text-brass-700" };
  if (daysLeft <= 3) return { text: `Due in ${daysLeft} days`, tone: "text-brass-700" };
  return { text: `Due in ${daysLeft} days`, tone: "text-ink-500" };
}

export default function AssignmentCard({ assignment, daysLeft }: { assignment: Assignment; daysLeft: number }) {
  const countdown = countdownLabel(daysLeft);

  return (
    <Link
      href={`/resources/assignments/${assignment.id}`}
      className="flex flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <SubjectBadge subject={assignment.subject} />
        <span className={clsx("inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap", countdown.tone)}>
          <IconClock className="h-3.5 w-3.5" />
          {countdown.text}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{assignment.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink-600">{assignment.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
        <span>Due {formatDate(assignment.dueDate)}</span>
        <span className="inline-flex items-center gap-1">
          <IconFileText className="h-3.5 w-3.5" />
          {assignment.attachments.length} attachment{assignment.attachments.length === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
