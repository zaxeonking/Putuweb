"use client";

import { motion } from "framer-motion";
import { Award, FileBadge2, Medal, Trophy } from "lucide-react";
import { ACHIEVEMENTS, CERTIFICATES, COMPETITION_AWARDS } from "@/lib/constants";

export function AchievementsStats() {
  const goldCount = COMPETITION_AWARDS.filter((a) => a.tier === "Gold").length;
  const studentRecipients = new Set(
    ACHIEVEMENTS.filter((a) => a.scope === "student" && a.recipient).map((a) => a.recipient),
  ).size;

  const stats = [
    { index: "01", icon: Trophy, label: "Total Achievements", value: String(ACHIEVEMENTS.length) },
    { index: "02", icon: Medal, label: "Gold Medals Won", value: String(goldCount) },
    { index: "03", icon: FileBadge2, label: "Certificates Earned", value: String(CERTIFICATES.length) },
    { index: "04", icon: Award, label: "Students Recognized", value: String(studentRecipients) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.65, 0, 0.35, 1] }}
          className="group relative flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-marigold dark:border-line-dark dark:bg-surface-dark"
        >
          <div className="flex items-center justify-between">
            <span className="index-label">{stat.index}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:text-muted-dark">
              <stat.icon size={16} />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted dark:text-muted-dark">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
