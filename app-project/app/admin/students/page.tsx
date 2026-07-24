import type { Metadata } from "next";
import { getClassSections } from "@/lib/student-data";
import StudentListClient from "@/components/StudentListClient";

export const metadata: Metadata = {
  title: "Students | Admin",
};

export default function AdminStudentsPage() {
  const sections = getClassSections();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Student Management</h2>
        <p className="mt-1 text-sm text-ink-500">
          Search, filter, and manage attendance for every student on the roster. Click a name to
          open the full profile.
        </p>
      </div>

      <StudentListClient sections={sections} />
    </div>
  );
}
