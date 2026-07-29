"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  /** Lift + glow on hover — for interactive/clickable cards. */
  interactive?: boolean;
  /** Reveal-on-scroll animation. Set false if the parent already staggers children. */
  animate?: boolean;
  delay?: number;
  padding?: "sm" | "md" | "lg" | "none";
}

const PADDING_STYLES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Base surface for every card across the site — the "ledger index card" motif.
 * Consistent border, radius, and background, with an optional interactive
 * hover state (lift + marigold glow) shared by every clickable card.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, interactive = false, animate = true, delay = 0, padding = "md", ...props }, ref) => {
    const content = (
      <div
        className={cn(
          "group relative rounded-2xl border border-line bg-surface dark:border-line-dark dark:bg-surface-dark",
          PADDING_STYLES[padding],
          interactive &&
            "cursor-pointer transition-all duration-300 ease-ledger hover:-translate-y-1 hover:border-marigold hover:shadow-[0_12px_32px_-16px_rgba(232,163,61,0.35)] dark:hover:shadow-[0_12px_32px_-16px_rgba(232,163,61,0.2)]",
          !interactive && "transition-colors duration-300",
          className,
        )}
      >
        {children}
      </div>
    );

    if (!animate) {
      return (
        <div ref={ref} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
          {content}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay, ease: [0.65, 0, 0.35, 1] }}
        {...props}
      >
        {content}
      </motion.div>
    );
  },
);
Card.displayName = "Card";
