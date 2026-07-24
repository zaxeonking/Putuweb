import type { Metadata } from "next";
import Link from "next/link";
import { getAssignmentById, getAssignmentDaysUntilDue } from "@/lib/resources-data";
import { formatDate } from "@/components/CategoryBadge";
import SubjectBadge from "@/components/resources/SubjectBadge";
import FileTypeTag from "@/components/resources/FileTypeTag";
import DownloadButton from "@/components/resources/DownloadButton";
import AssignmentSubmitPanel from "@/components/resources/AssignmentSubmitPanel";
import { IconArrowRight, IconClock } from "@/components/icons";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const assignment = await getAssignmentById(params.id);
  return { title: assignment ? `${assignment.title} | Assignments` : "Assignment | Class Site" };
}

export default async function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const assignment = await getAssignmentById(params.id);

  if (!assignment) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Assignment not found" message="It may have been removed or the link is out of date." />
        <div className="mt-6">
          <Link href="/resources/assignments" className="text-sm font-medium text-brass-600 hover:underline">
            Back to all assignments
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = getAssignmentDaysUntilDue(assignment.dueDate);
  const dueLabel =
    daysLeft < 0
      ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} past due`
      : daysLeft === 0
        ? "Due today"
        : `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;

  return (
    <div className="container-page py-16">
      <Link
        href="/resources/assignments"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <IconArrowRight className="h-4 w-4 rotate-180" />
        All assignments
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SubjectBadge subject={assignment.subject} />
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">
          {assignment.gradeLevel}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brass-700">
          <IconClock className="h-4 w-4" />
          {dueLabel}
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900">{assignment.title}</h1>
      <p className="mt-2 text-sm text-ink-500">
        Assigned {formatDate(assignment.assignedDate)} · Due {formatDate(assignment.dueDate)} ·{" "}
        {assignment.points} points
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">Description</h2>
          <p className="mt-2 text-ink-700">{assignment.description}</p>

          <h2 className="mt-6 font-display text-lg font-semibold text-ink-900">Instructions</h2>
          <p className="mt-2 text-ink-700">{assignment.instructions}</p>

          <div className="mt-8">
            <AssignmentSubmitPanel assignmentTitle={assignment.title} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-base font-semibold text-ink-900">Attachments</h2>
          {assignment.attachments.length === 0 ? (
            <p className="mt-2 text-sm text-ink-500">No attachments for this assignment.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {assignment.attachments.map((att) => (
                <li
                  key={att.id}
                  className="flex flex-col gap-2 rounded-lg border border-ink-100 bg-white p-3 shadow-card"
                >
                  <p className="text-sm font-medium text-ink-800">{att.name}</p>
                  <div className="flex items-center justify-between">
                    <FileTypeTag fileType={att.fileType} sizeLabel={att.sizeLabel} />
                    <DownloadButton fileName={att.name} variant="outline" label="Download" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
