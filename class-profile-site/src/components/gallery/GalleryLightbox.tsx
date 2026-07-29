"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GALLERY_GRADIENTS } from "@/lib/constants";
import { GalleryPhoto } from "@/types";
import { PhotoPlaceholder } from "@/components/gallery/PhotoPlaceholder";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export function GalleryLightbox({ photos, index, onClose, onNavigate }: GalleryLightboxProps) {
  const isOpen = index !== null;
  const photo = isOpen ? photos[index] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const style = photo ? GALLERY_GRADIENTS[photo.category] : null;

  return (
    <AnimatePresence>
      {photo && style && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm dark:bg-black/80 sm:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-marigold hover:text-marigold"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-marigold hover:text-marigold sm:flex sm:left-6"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-marigold hover:text-marigold sm:flex sm:right-6"
          >
            <ChevronRight size={20} />
          </button>

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={photo.title}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl dark:border-line-dark dark:bg-surface-dark"
          >
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <PhotoPlaceholder photo={photo} showLabel iconSize={32} />
            </div>

            <div className="flex flex-col gap-3 p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest", style.chip)}>
                  {photo.date}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
                  {String(index! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-ink dark:text-ink-dark sm:text-2xl">
                {photo.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">{photo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
