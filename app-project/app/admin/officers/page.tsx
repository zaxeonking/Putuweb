import type { Metadata } from "next";
import { getClassOfficers } from "@/lib/student-data";
import OfficerCard from "@/components/OfficerCard";
import EmptyState from "@/components/EmptyState";
import { IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  title: "Class Officers | Admin",
};

export default async function AdminOfficersPage() {
  const officers = await getClassOfficers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Class Officers</h2>
        <p className="mt-1 text-sm text-ink-500">
          Student leadership roles for the current term, along with what each role is responsible
          for and how to reach them.
        </p>
      </div>

      {officers.length === 0 ? (
        <EmptyState
          icon={<IconUsers className="h-10 w-10" />}
          title="No class officers assigned"
          message="Officer roles for the current term will appear here once assigned."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {officers.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      )}
    </div>
  );
}
