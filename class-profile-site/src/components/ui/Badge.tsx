import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "marigold" | "ivy" | "custom";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  /** Pass a full pre-composed class string (e.g. from a color-map lookup) to override tone entirely. */
  colorClassName?: string;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

const TONE_STYLES: Record<Exclude<BadgeTone, "custom">, string> = {
  neutral:
    "border-line bg-paper text-muted dark:border-line-dark dark:bg-paper-dark dark:text-muted-dark",
  marigold: "border-marigold/30 bg-marigold/10 text-marigold dark:text-marigold-light",
  ivy: "border-ivy/30 bg-ivy/10 text-ivy dark:text-ivy-light",
};

/**
 * Small pill/chip label. Used for roles, categories, levels, subjects, tiers.
 * Pass `colorClassName` for pages that already compute a specific color map
 * (e.g. SUBJECT_COLORS, LEVEL_BADGES) so those keep their exact semantic colors.
 */
export function Badge({
  children,
  tone = "neutral",
  colorClassName,
  className,
  dot = false,
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-widest",
        size === "md" ? "px-3 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]",
        "transition-colors",
        colorClassName ?? TONE_STYLES[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
