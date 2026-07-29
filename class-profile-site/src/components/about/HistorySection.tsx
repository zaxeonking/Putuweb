"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/about/SectionHeading";
import { ABOUT } from "@/lib/constants";

export function HistorySection() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <SectionHeading
        index="04 — History"
        title="How PUTU came to be."
        description="A short account of how a homeroom became a class with its own name."
      />

      <div className="flex flex-col gap-5">
        {ABOUT.history.paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
            className="text-base leading-relaxed text-muted dark:text-muted-dark first:font-display first:text-lg first:italic first:text-ink dark:first:text-ink-dark"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
