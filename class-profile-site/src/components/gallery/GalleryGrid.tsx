"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Images } from "lucide-react";
import { GALLERY_PHOTOS } from "@/lib/constants";
import { GalleryCategoryId, GalleryPhoto } from "@/types";
import { GalleryFilterBar } from "@/components/gallery/GalleryFilterBar";
import { PhotoCard } from "@/components/gallery/PhotoCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory);
  }, [activeCategory]);

  const handleSelect = (photo: GalleryPhoto) => {
    const idx = filtered.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx === -1 ? null : idx);
  };

  const handleCategoryChange = (id: GalleryCategoryId) => {
    setActiveCategory(id);
    setLightboxIndex(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <GalleryFilterBar
        active={activeCategory}
        onChange={handleCategoryChange}
        totalCount={GALLERY_PHOTOS.length}
        resultCount={filtered.length}
      />

      {filtered.length > 0 ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <PhotoCard key={photo.id} photo={photo} delay={Math.min(i, 10) * 0.04} onSelect={handleSelect} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center dark:border-line-dark">
          <Images className="h-6 w-6 text-muted dark:text-muted-dark" />
          <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
            No photos in this category yet.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">Try a different category from the filter above.</p>
        </div>
      )}

      <GalleryLightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
