import type { Metadata } from "next";
import { getTeacherDepartments, getTeachers } from "@/lib/student-data";
import TeacherCard from "@/components/TeacherCard";
import EmptyState from "@/components/EmptyState";
import { IconBriefcase } from "@/components/icons";

export const metadata: Metadata = {
  title: "Teachers | Admin",
};

export default async function AdminTeachersPage() {
  const [teachers, departments] = await Promise.all([getTeachers(), Promise.resolve(getTeacherDepartments())]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Teacher Directory</h2>
        <p className="mt-1 text-sm text-ink-500">
          Specializations, contact details, and office hours for every staff member working with the
          class, organized by department.
        </p>
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          icon={<IconBriefcase className="h-10 w-10" />}
          title="No teachers on file"
          message="Teacher profiles will appear here once added."
        />
      ) : (
        departments.map((department) => {
          const inDepartment = teachers.filter((t) => t.department === department);
          if (inDepartment.length === 0) return null;

          return (
            <div key={department}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-brass-600">
                {department}
              </h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {inDepartment.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
