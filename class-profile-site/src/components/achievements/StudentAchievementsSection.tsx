"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/about/SectionHeading";
import { TrophyCard } from "@/components/achievements/TrophyCard";
import { ACHIEVEMENTS } from "@/lib/constants";
import { AchievementCategory } from "@/types";

const CATEGORIES: (AchievementCategory | "All")[] = [
  "All",
  "Academic",
  "Sports",
  "Arts",
  "Technology",
];

export function StudentAchievementsSection() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");

  const studentAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => a.scope === "student").filter(
      (a) => filter === "All" || a.category === filter,
    );
  }, [filter]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          index="02 — By Name"
          title="Student Achievements"
          description="Individual wins, each one still counted as part of the class record."
        />

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors duration-300",
                filter === category
                  ? "border-marigold bg-marigold text-white"
                  : "border-line text-muted hover:border-marigold hover:text-marigold dark:border-line-dark dark:text-muted-dark",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {studentAchievements.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {studentAchievements.map((achievement, i) => (
              <TrophyCard key={achievement.id} achievement={achievement} delay={i * 0.06} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-16 text-center dark:border-line-dark">
          <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
            No achievements in this category yet.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">
            Try a different filter — the shelf is still filling up.
          </p>
        </div>
      )}
    </div>
  );
}
