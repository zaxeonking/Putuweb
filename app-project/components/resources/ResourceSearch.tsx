"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ResourceSearchResult } from "@/lib/types";
import { IconSearch } from "@/components/icons";
import SubjectBadge from "./SubjectBadge";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-brass-200/70 px-0.5 text-ink-900">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const KIND_LINK: Record<ResourceSearchResult["kind"], (id: string) => string> = {
  assignment: (id) => `/resources/assignments/${id}`,
  material: () => `/resources/materials`,
  video: () => `/resources/videos`,
};

const KIND_LABEL: Record<ResourceSearchResult["kind"], string> = {
  assignment: "Assignment",
  material: "Material",
  video: "Video",
};

export default function ResourceSearch({ index }: { index: ResourceSearchResult[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q)
    );
  }, [index, query]);

  return (
    <div>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all resources by title, subject, or content"
          className="w-full rounded-md border border-ink-200 bg-white py-3 pl-10 pr-3 text-sm text-ink-700 placeholder:text-ink-400"
          aria-label="Search all learning resources"
        />
      </div>

      {query.trim() && (
        <div className="mt-3 rounded-xl border border-ink-100 bg-white shadow-card">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-ink-500">No resources match &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {results.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link
                    href={KIND_LINK[r.kind](r.id)}
                    className="flex flex-col gap-1 px-4 py-3 hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                        {KIND_LABEL[r.kind]}
                      </span>
                      <span className="font-medium text-ink-900">{highlight(r.title, query)}</span>
                      <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">{highlight(r.snippet, query)}</p>
                    </div>
                    <SubjectBadge subject={r.subject} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
