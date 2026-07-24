"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { GradeLevel, LearningMaterial, MaterialCategory, ResourceSubject } from "@/lib/types";
import MaterialCard from "./MaterialCard";
import EmptyState from "@/components/EmptyState";
import { IconDownload, IconFolder, IconSearch } from "@/components/icons";

export default function MaterialsBrowser({
  materials,
  subjects,
  categories,
  gradeLevels,
}: {
  materials: LearningMaterial[];
  subjects: ResourceSubject[];
  categories: MaterialCategory[];
  gradeLevels: GradeLevel[];
}) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<ResourceSubject | "all">("all");
  const [category, setCategory] = useState<MaterialCategory | "all">("all");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      if (subject !== "all" && m.subject !== subject) return false;
      if (category !== "all" && m.category !== category) return false;
      if (gradeLevel !== "all" && m.gradeLevel !== gradeLevel && m.gradeLevel !== "All Grades") return false;
      if (
        q &&
        !(
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
        )
      ) {
        return false;
      }
      return true;
    });
  }, [materials, query, subject, category, gradeLevel]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBatchDownload() {
    const names = materials.filter((m) => selected.has(m.id)).map((m) => `${m.title}.${m.fileType}`);
    console.log("[resources:batch-download]", { files: names, at: new Date().toISOString() });
    toast.success(`Downloading ${names.length} file${names.length === 1 ? "" : "s"}`);
    setSelected(new Set());
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[220px]">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials by title, subject, or tag"
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400"
            aria-label="Search learning materials"
          />
        </div>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as ResourceSubject | "all")}
          className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700"
          aria-label="Filter by subject"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MaterialCategory | "all")}
          className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value as GradeLevel | "all")}
          className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700"
          aria-label="Filter by grade level"
        >
          <option value="all">All grade levels</option>
          {gradeLevels.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-ink-400">
        <span>
          {filtered.length} material{filtered.length === 1 ? "" : "s"}
        </span>
        {selected.size > 0 && (
          <button
            type="button"
            onClick={handleBatchDownload}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-50 hover:bg-ink-800"
          >
            <IconDownload className="h-4 w-4" />
            Download {selected.size} selected
          </button>
        )}
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconFolder className="h-10 w-10" />}
            title="No materials match those filters"
            message="Try a broader search or clear a filter."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MaterialCard key={m.id} material={m} selected={selected.has(m.id)} onToggleSelect={toggleSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
