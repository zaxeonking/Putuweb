"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/about/SectionHeading";
import { ABOUT } from "@/lib/constants";

export function MottoSection() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <SectionHeading
        index="08 — The Motto"
        title={`"${ABOUT.motto.phrase}"`}
        description={ABOUT.motto.summary}
      />

      <div className="flex flex-col">
        {ABOUT.motto.parts.map((part, i) => (
          <motion.div
            key={part.word}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
            className="rule flex flex-col gap-1 py-5 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="w-40 shrink-0 font-display text-xl font-semibold text-marigold dark:text-marigold-light">
              {part.word}
            </span>
            <span className="text-base leading-relaxed text-muted dark:text-muted-dark">
              {part.meaning}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
