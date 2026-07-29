"use client";

import { motion } from "framer-motion";
import { QUICK_INFO } from "@/lib/constants";
import { QuickInfoCard } from "@/components/home/QuickInfoCard";

export function QuickInfoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {QUICK_INFO.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.65, 0, 0.35, 1] }}
        >
          <QuickInfoCard {...item} />
        </motion.div>
      ))}
    </div>
  );
}
