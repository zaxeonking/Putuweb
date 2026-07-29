"use client";

import { motion } from "framer-motion";
import { Cpu, GraduationCap, Palette, Trophy, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_BADGES, LEVEL_BADGES } from "@/lib/constants";
import { Achievement } from "@/types";

const CATEGORY_ICONS: Record<Achievement["category"], typeof Trophy> = {
  Academic: GraduationCap,
  Sports: Trophy,
  Arts: Palette,
  Technology: Cpu,
  "Class Spirit": Users2,
};

interface TrophyCardProps {
  achievement: Achievement;
  delay?: number;
}

export function TrophyCard({ achievement, delay = 0 }: TrophyCardProps) {
  const Icon = CATEGORY_ICONS[achievement.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -6, rotate: -0.4 }}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 ease-ledger hover:border-marigold hover:shadow-[0_18px_40px_-18px_rgba(232,163,61,0.35)] dark:border-line-dark dark:bg-surface-dark dark:hover:shadow-[0_18px_40px_-18px_rgba(232,163,61,0.18)]"
    >
      {/* placeholder trophy art */}
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-marigold/20 via-surface to-ivy/10 dark:from-marigold/15 dark:via-surface-dark dark:to-ivy/10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1, ease: [0.65, 0, 0.35, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/70 ring-1 ring-line transition-transform duration-300 ease-ledger group-hover:scale-110 dark:bg-paper-dark/60 dark:ring-line-dark"
        >
          <Trophy className="h-7 w-7 text-marigold" />
        </motion.div>
        <span className="absolute right-3 top-3 rounded-full border border-line bg-paper/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted dark:border-line-dark dark:bg-paper-dark/70 dark:text-muted-dark">
          {achievement.year}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm" colorClassName={LEVEL_BADGES[achievement.level]}>
            {achievement.level}
          </Badge>
          <Badge size="sm" colorClassName={CATEGORY_BADGES[achievement.category]}>
            <Icon className="h-3 w-3" />
            {achievement.category}
          </Badge>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink dark:text-ink-dark">
            {achievement.title}
          </h3>
          {achievement.recipient && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-marigold dark:text-marigold-light">
              {achievement.recipient}
            </p>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          {achievement.description}
        </p>

        <span className="mt-1 self-start rounded-full bg-ivy/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-ivy dark:bg-ivy/15 dark:text-ivy-light">
          {achievement.placement}
        </span>
      </div>
    </motion.div>
  );
}
