import type { Metadata } from "next";
import { getAssignments, RESOURCE_SUBJECTS } from "@/lib/resources-data";
import AssignmentsBrowser from "@/components/resources/AssignmentsBrowser";

export const metadata: Metadata = { title: "Assignments | Class Site" };

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">Learning Materials</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Assignments</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Browse current and past assignments with due-date countdowns. Tap any assignment to see full
        details, instructions, and attachments.
      </p>

      <div className="mt-8">
        <AssignmentsBrowser assignments={assignments} subjects={RESOURCE_SUBJECTS} />
      </div>
    </div>
  );
}
