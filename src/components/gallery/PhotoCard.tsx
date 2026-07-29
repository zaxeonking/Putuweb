"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { GALLERY_GRADIENTS } from "@/lib/constants";
import { GalleryPhoto, PhotoOrientation } from "@/types";
import { PhotoPlaceholder } from "@/components/gallery/PhotoPlaceholder";

const ASPECT_BY_ORIENTATION: Record<PhotoOrientation, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[3/5]",
  wide: "aspect-[16/9]",
};

interface PhotoCardProps {
  photo: GalleryPhoto;
  delay?: number;
  onSelect: (photo: GalleryPhoto) => void;
}

export function PhotoCard({ photo, delay = 0, onSelect }: PhotoCardProps) {
  const style = GALLERY_GRADIENTS[photo.category];

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, delay, ease: [0.65, 0, 0.35, 1] }}
      onClick={() => onSelect(photo)}
      aria-label={`Open ${photo.title}`}
      className={cn(
        "group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm",
        "transition-all duration-300 ease-ledger hover:-translate-y-1 hover:border-marigold hover:shadow-lg",
        "dark:border-line-dark dark:bg-surface-dark",
      )}
    >
      <div className={cn("relative w-full", ASPECT_BY_ORIENTATION[photo.orientation])}>
        <div className="absolute inset-0 transition-transform duration-500 ease-ledger group-hover:scale-[1.06]">
          <PhotoPlaceholder photo={photo} />
        </div>

        {/* darken + rise overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 ease-ledger group-hover:opacity-100 dark:from-black/85 dark:via-black/10" />

        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 flex-col gap-1.5 p-4 opacity-0 transition-all duration-300 ease-ledger group-hover:translate-y-0 group-hover:opacity-100">
          <Badge size="sm" className="self-start" colorClassName={cn(style.chip, "backdrop-blur-sm")}>
            {photo.date}
          </Badge>
          <h3 className="font-display text-base font-semibold leading-snug text-white">{photo.title}</h3>
        </div>

        <div className="absolute right-3 top-3 flex h-8 w-8 -translate-y-1 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 ease-ledger group-hover:translate-y-0 group-hover:opacity-100">
          <Expand size={14} />
        </div>

        {photo.featured && (
          <span className="absolute left-3 top-3 rounded-full border border-marigold/40 bg-marigold/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink shadow-sm">
            Featured
          </span>
        )}
      </div>
    </motion.button>
  );
}
