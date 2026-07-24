import type { Metadata } from "next";
import {
  getAssignments,
  getLearningMaterials,
  getVideoResources,
  MATERIAL_CATEGORIES,
} from "@/lib/resources-data";
import { formatDate } from "@/components/CategoryBadge";
import SubjectBadge from "@/components/resources/SubjectBadge";
import FileTypeTag from "@/components/resources/FileTypeTag";

export const metadata: Metadata = { title: "Learning Materials | Admin" };

export default async function AdminMaterialsPage() {
  const [assignments, materials, videos] = await Promise.all([
    getAssignments(),
    getLearningMaterials(),
    getVideoResources(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Learning Materials & Resources</h2>
        <p className="mt-1 text-sm text-ink-500">
          Manage the assignments, downloadable materials, and videos shown on the public Resources
          pages. This view is read-only for now — create/edit forms are the next iteration once this
          module connects to a real database (see the API-integration note in <code>lib/resources-data.ts</code>).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <p className="text-sm text-ink-500">Assignments</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{assignments.length}</p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <p className="text-sm text-ink-500">Learning materials</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{materials.length}</p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <p className="text-sm text-ink-500">Videos</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{videos.length}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brass-600">Assignments</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-ink-500">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Subject</th>
                <th className="px-4 py-2 font-medium">Due</th>
                <th className="px-4 py-2 font-medium">Attachments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 font-medium text-ink-800">{a.title}</td>
                  <td className="px-4 py-2">
                    <SubjectBadge subject={a.subject} />
                  </td>
                  <td className="px-4 py-2 text-ink-600">{formatDate(a.dueDate)}</td>
                  <td className="px-4 py-2 text-ink-600">{a.attachments.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brass-600">Materials by category</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_CATEGORIES.map((category) => {
            const inCategory = materials.filter((m) => m.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category} className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                <p className="text-sm font-semibold text-ink-800">{category}</p>
                <p className="mt-1 text-xs text-ink-400">{inCategory.length} file(s)</p>
                <ul className="mt-2 space-y-1.5">
                  {inCategory.slice(0, 3).map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 text-xs text-ink-600">
                      <span className="truncate">{m.title}</span>
                      <FileTypeTag fileType={m.fileType} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
