import { cn } from "@/lib/utils";
import { GALLERY_GRADIENTS } from "@/lib/constants";
import { GalleryPhoto } from "@/types";
import { CATEGORY_ICON_BY_ID } from "@/components/gallery/icons";

interface PhotoPlaceholderProps {
  photo: GalleryPhoto;
  className?: string;
  iconSize?: number;
  showLabel?: boolean;
}

export function PhotoPlaceholder({
  photo,
  className,
  iconSize = 22,
  showLabel = false,
}: PhotoPlaceholderProps) {
  const style = GALLERY_GRADIENTS[photo.category];
  const Icon = CATEGORY_ICON_BY_ID[photo.category];

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        "bg-paper dark:bg-paper-dark",
        style.gradient,
        className,
      )}
    >
      {/* subtle shimmer — reads as "still developing" rather than a broken image */}
      <div className="skeleton absolute inset-0 opacity-[0.35] dark:opacity-[0.25]" />
      {/* faint ledger grid, evokes the "photo not yet scanned" feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-line/70 dark:border-line-dark/70" />

      <div
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full border border-line/80 bg-surface/70 backdrop-blur-sm dark:border-line-dark/80 dark:bg-surface-dark/60",
          "transition-transform duration-500 ease-ledger group-hover:scale-110",
        )}
        style={{ padding: iconSize * 0.55 }}
      >
        <Icon size={iconSize} className={style.iconColor} />
      </div>

      {showLabel && (
        <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
          Photo scan coming soon
        </span>
      )}
    </div>
  );
}
