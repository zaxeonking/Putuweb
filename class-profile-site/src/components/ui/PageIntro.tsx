"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.65, 0, 0.35, 1] as const },
  }),
};

interface PageIntroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Show the "X-7" class code beside the title, ledger-style. Default true. */
  showClassCode?: boolean;
  className?: string;
}

/**
 * The page-header block repeated at the top of every inner page — eyebrow
 * index label, oversized display title (+ class code), and a lead paragraph.
 * Consolidates what used to be 7 near-identical "*Intro" components.
 */
export function PageIntro({ eyebrow, title, lead, showClassCode = true, className }: PageIntroProps) {
  return (
    <div className={cn("flex flex-col items-start gap-5 py-20 sm:py-28", className)}>
      <motion.span
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="index-label"
      >
        {eyebrow}
      </motion.span>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.08}
        className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink dark:text-ink-dark sm:text-6xl lg:text-7xl"
      >
        {title}
        {showClassCode && (
          <span className="ml-4 align-middle font-mono text-lg font-normal uppercase tracking-widest text-muted dark:text-muted-dark">
            {SITE.classCode}
          </span>
        )}
      </motion.h1>

      {lead && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.18}
          className="max-w-xl text-lg leading-relaxed text-muted dark:text-muted-dark"
        >
          {lead}
        </motion.p>
      )}
    </div>
  );
}
