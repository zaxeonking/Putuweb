"use client";

import { motion } from "framer-motion";
import { Mars, Venus } from "lucide-react";
import { CLASS_INFO } from "@/lib/constants";

export function GenderRatioBar() {
  const { totalStudents, maleStudents, femaleStudents } = CLASS_INFO;
  const malePct = Math.round((maleStudents / totalStudents) * 1000) / 10;
  const femalePct = Math.round((femaleStudents / totalStudents) * 1000) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark">
        <span className="flex items-center gap-1.5 text-ink dark:text-ink-dark">
          <Mars size={13} className="text-sky-500" /> {maleStudents} Male · {malePct}%
        </span>
        <span className="flex items-center gap-1.5 text-ink dark:text-ink-dark">
          {femalePct}% · {femaleStudents} Female <Venus size={13} className="text-rose-500" />
        </span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-paper dark:bg-paper-dark">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${malePct}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="h-full bg-sky-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${femalePct}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="h-full bg-rose-500"
        />
      </div>
    </motion.div>
  );
}
