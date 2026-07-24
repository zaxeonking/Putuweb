"use client";

import { useEffect } from "react";
import type { LearningMaterial } from "@/lib/types";
import { formatDate } from "@/components/CategoryBadge";
import { IconX } from "@/components/icons";
import SubjectBadge from "./SubjectBadge";
import FileTypeTag from "./FileTypeTag";
import DownloadButton from "./DownloadButton";

export default function MaterialPreviewModal({
  material,
  onClose,
}: {
  material: LearningMaterial;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${material.title}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-1.5">
              <SubjectBadge subject={material.subject} />
              <span className="inline-flex items-center rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">
                {material.category}
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink-900">{material.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-ink-600">{material.description}</p>

        <div className="mt-4 rounded-lg border border-dashed border-ink-200 bg-ink-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Content preview</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{material.previewSnippet}</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
          <span>{material.gradeLevel}</span>
          <span>Added {formatDate(material.dateAdded)}</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <FileTypeTag fileType={material.fileType} sizeLabel={material.sizeLabel} />
          <DownloadButton fileName={`${material.title}.${material.fileType}`} />
        </div>
      </div>
    </div>
  );
}
