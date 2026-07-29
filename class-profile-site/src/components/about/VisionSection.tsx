"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/lib/constants";

export function VisionSection() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="index-label"
      >
        05 — Vision
      </motion.span>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        className="max-w-3xl font-display text-3xl italic leading-snug tracking-tight text-ink dark:text-ink-dark sm:text-4xl lg:text-5xl"
      >
        &ldquo;{ABOUT.vision}&rdquo;
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="h-px w-16 origin-center bg-marigold"
      />
    </div>
  );
}
