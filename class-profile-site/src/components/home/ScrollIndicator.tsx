"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
        Scroll
      </span>
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted dark:border-line-dark dark:text-muted-dark"
      >
        <ChevronDown size={14} />
      </motion.div>
    </motion.div>
  );
}
