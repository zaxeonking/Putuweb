"use client";

import { useEffect, useMemo, useState } from "react";
import type { LearningMaterial } from "@/lib/types";
import MaterialCard from "./MaterialCard";
import { getViewedMaterialIds } from "./viewedMaterials";
import { IconSparkle } from "@/components/icons";

function recommend(materials: LearningMaterial[], viewedIds: string[], limit = 4): LearningMaterial[] {
  if (viewedIds.length === 0) return materials.slice(0, limit);

  const viewed = materials.filter((m) => viewedIds.includes(m.id));
  const viewedSubjects = new Set(viewed.map((m) => m.subject));
  const viewedTags = new Set(viewed.flatMap((m) => m.tags));

  return materials
    .filter((m) => !viewedIds.includes(m.id))
    .map((m) => {
      let score = 0;
      if (viewedSubjects.has(m.subject)) score += 2;
      score += m.tags.filter((t) => viewedTags.has(t)).length;
      return { material: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.material);
}

export default function RecommendedMaterials({ materials }: { materials: LearningMaterial[] }) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    setViewedIds(getViewedMaterialIds());
    function handleChange() {
      setViewedIds(getViewedMaterialIds());
    }
    window.addEventListener("viewed-materials-changed", handleChange);
    return () => window.removeEventListener("viewed-materials-changed", handleChange);
  }, []);

  const recommended = useMemo(() => recommend(materials, viewedIds), [materials, viewedIds]);

  if (recommended.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2">
        <IconSparkle className="h-5 w-5 text-brass-500" />
        <h2 className="font-display text-xl font-semibold text-ink-900">
          {viewedIds.length > 0 ? "Recommended for you" : "Popular resources"}
        </h2>
      </div>
      <p className="mt-1 text-sm text-ink-500">
        {viewedIds.length > 0
          ? "Based on materials you've previewed recently."
          : "Preview a few materials and this section will personalize."}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recommended.map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}
