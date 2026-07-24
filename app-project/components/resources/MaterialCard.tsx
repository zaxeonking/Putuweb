"use client";

import { useState } from "react";
import type { LearningMaterial } from "@/lib/types";
import { formatDate } from "@/components/CategoryBadge";
import { IconEye, IconFolder } from "@/components/icons";
import SubjectBadge from "./SubjectBadge";
import FileTypeTag from "./FileTypeTag";
import DownloadButton from "./DownloadButton";
import MaterialPreviewModal from "./MaterialPreviewModal";
import { markMaterialViewed } from "./viewedMaterials";

export default function MaterialCard({
  material,
  selected,
  onToggleSelect,
}: {
  material: LearningMaterial;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-ink-50 text-ink-300">
            <IconFolder className="h-7 w-7" />
          </div>
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => onToggleSelect(material.id)}
              aria-label={`Select ${material.title} for batch download`}
              className="h-4 w-4 rounded border-ink-300 text-brass-600 focus:ring-brass-400"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <SubjectBadge subject={material.subject} />
          <span className="inline-flex items-center rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">
            {material.category}
          </span>
        </div>

        <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{material.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-600">{material.description}</p>

        <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
          <span>{material.gradeLevel}</span>
          <span>Added {formatDate(material.dateAdded)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <FileTypeTag fileType={material.fileType} sizeLabel={material.sizeLabel} />
          <button
            type="button"
            onClick={() => {
              setPreviewOpen(true);
              markMaterialViewed(material.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900"
          >
            <IconEye className="h-4 w-4" />
            Preview
          </button>
        </div>

        <div className="mt-2">
          <DownloadButton fileName={`${material.title}.${material.fileType}`} variant="outline" />
        </div>
      </div>

      {previewOpen && <MaterialPreviewModal material={material} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
