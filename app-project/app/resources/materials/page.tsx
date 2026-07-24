import type { Metadata } from "next";
import { getLearningMaterials, RESOURCE_SUBJECTS, MATERIAL_CATEGORIES, GRADE_LEVELS } from "@/lib/resources-data";
import MaterialsBrowser from "@/components/resources/MaterialsBrowser";

export const metadata: Metadata = { title: "Materials Library | Class Site" };

export default async function MaterialsPage() {
  const materials = await getLearningMaterials();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">Learning Materials</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Materials Library</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Worksheets, readings, study guides, and reference sheets organized by subject and type. Preview
        anything before downloading, or select several files for a batch download.
      </p>

      <div className="mt-8">
        <MaterialsBrowser
          materials={materials}
          subjects={RESOURCE_SUBJECTS}
          categories={MATERIAL_CATEGORIES}
          gradeLevels={GRADE_LEVELS}
        />
      </div>
    </div>
  );
}
