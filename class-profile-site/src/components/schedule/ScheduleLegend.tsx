"use client";

import { motion } from "framer-motion";
import { SCHEDULE, SUBJECT_COLORS } from "@/lib/constants";

export function ScheduleLegend() {
  const subjects = new Map<string, string>();
  for (const row of SCHEDULE) {
    if (row.type !== "period") continue;
    for (const entry of Object.values(row.entries)) {
      if (entry && !subjects.has(entry.colorKey)) {
        subjects.set(entry.colorKey, entry.subject);
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      {Array.from(subjects.entries()).map(([colorKey, subject], i) => (
        <motion.div
          key={colorKey}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.03 }}
          className="flex items-center gap-2"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${SUBJECT_COLORS[colorKey]?.dot}`} />
          <span className="text-xs text-muted dark:text-muted-dark">{subject}</span>
        </motion.div>
      ))}
    </div>
  );
}
