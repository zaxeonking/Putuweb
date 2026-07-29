"use client";

import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { LEVEL_BADGES, TIER_STYLES } from "@/lib/constants";
import { CompetitionAward } from "@/types";

interface AwardCardProps {
  award: CompetitionAward;
  delay?: number;
}

export function AwardCard({ award, delay = 0 }: AwardCardProps) {
  const tier = TIER_STYLES[award.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -4 }}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors duration-300 ease-ledger hover:border-marigold dark:border-line-dark dark:bg-surface-dark"
    >
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ring-1 transition-transform duration-300 ease-ledger group-hover:scale-105",
          tier.ring,
        )}
      >
        <Medal className="h-6 w-6 text-ink/70 dark:text-ink-dark/70" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm" colorClassName={tier.chip}>{award.tier}</Badge>
          <Badge size="sm" colorClassName={LEVEL_BADGES[award.level]}>{award.level}</Badge>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
            {award.year}
          </span>
        </div>

        <h3 className="truncate font-display text-base font-semibold text-ink dark:text-ink-dark">
          {award.competition}
        </h3>
        <p className="truncate text-xs text-muted dark:text-muted-dark">
          {award.organizer} · <span className="text-ink/80 dark:text-ink-dark/80">{award.representative}</span>
        </p>
      </div>
    </motion.div>
  );
}
