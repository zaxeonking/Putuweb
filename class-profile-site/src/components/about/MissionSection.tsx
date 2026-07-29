"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/about/SectionHeading";
import { ABOUT } from "@/lib/constants";

export function MissionSection() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index="06 — Mission"
        title="What we're actually here to do."
        description="Four commitments, kept in the same order every year."
      />

      <ul className="flex flex-col">
        {ABOUT.mission.map((item, i) => (
          <motion.li
            key={item.index}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.65, 0, 0.35, 1] }}
            className="rule flex items-start gap-6 py-5 first:border-t-0"
          >
            <span className="font-mono text-sm text-marigold dark:text-marigold-light">
              {item.index}
            </span>
            <span className="text-lg leading-snug text-ink dark:text-ink-dark">
              {item.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
