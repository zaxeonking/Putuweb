"use client";

import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GalleryCategoryId } from "@/types";
import { CATEGORY_ICONS } from "@/components/gallery/icons";

interface GalleryFilterBarProps {
  active: GalleryCategoryId;
  onChange: (id: GalleryCategoryId) => void;
  totalCount: number;
  resultCount: number;
}

export function GalleryFilterBar({ active, onChange, totalCount, resultCount }: GalleryFilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {GALLERY_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.icon];
          const isActive = active === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              aria-pressed={isActive}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ease-ledger",
                isActive
                  ? "border-marigold bg-marigold text-ink"
                  : "border-line bg-surface text-muted hover:border-marigold hover:text-ink dark:border-line-dark dark:bg-surface-dark dark:text-muted-dark dark:hover:text-ink-dark",
              )}
            >
              <Icon size={13} />
              {category.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="font-mono text-xs uppercase tracking-widest text-muted dark:text-muted-dark">
        Showing {resultCount} of {totalCount}
      </p>
    </div>
  );
}
