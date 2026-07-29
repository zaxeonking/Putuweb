"use client";

import { motion } from "framer-motion";
import { HeartHandshake, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/about/SectionHeading";
import { ABOUT } from "@/lib/constants";
import { PhilosophyPillar } from "@/types";

const ICONS: Record<PhilosophyPillar["icon"], typeof HeartHandshake> = {
  "heart-handshake": HeartHandshake,
  "trending-up": TrendingUp,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
};

export function PhilosophySection() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index="07 — Philosophy"
        title="The four ideas everything else is built on."
        align="center"
        className="mx-auto"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.philosophy.map((pillar, i) => {
          const Icon = ICONS[pillar.icon];
          return (
            <motion.div
              key={pillar.index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.65, 0, 0.35, 1] }}
              className="group flex flex-col gap-4 rounded-2xl border border-line p-6 transition-colors hover:border-marigold dark:border-line-dark"
            >
              <div className="flex items-center justify-between">
                <span className="index-label">{pillar.index}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:text-muted-dark">
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-muted-dark">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
