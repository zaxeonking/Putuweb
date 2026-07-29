"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ClassPhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
      className="relative w-full"
    >
      <div
        className={[
          "relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[4/5]",
          "border border-line dark:border-line-dark",
          "bg-gradient-to-br from-surface via-paper to-line/40",
          "dark:from-surface-dark dark:via-paper-dark dark:to-line-dark/40",
        ].join(" ")}
      >
        {/* subtle shimmer, ties this placeholder to the site's loading language */}
        <div className="skeleton absolute inset-0 opacity-[0.3] dark:opacity-[0.2]" />

        {/* Placeholder art: soft radial glow + camera mark, swap for <Image> later */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-muted dark:text-muted-dark">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper/60 dark:border-line-dark dark:bg-paper-dark/60">
            <Camera size={22} />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest">
            Class photo coming soon
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(232,163,61,0.12),transparent_55%)]" />
      </div>

      {/* Caption strip, like a print tucked under a yearbook photo */}
      <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark">
        <span>{SITE.fullName} — Group Photo</span>
        <span>2025 / 2026</span>
      </div>
    </motion.div>
  );
}
