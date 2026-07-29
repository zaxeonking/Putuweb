"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy } from "lucide-react";
import { SectionHeading } from "@/components/about/SectionHeading";
import { cn } from "@/lib/utils";
import { ACHIEVEMENT_TIMELINE } from "@/lib/constants";

export function AchievementTimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        index="05 — The Shelf, Chronologically"
        title="Achievement Timeline"
        description="From the first certificate of merit to the latest medal — in the order it happened."
        align="center"
        className="mx-auto"
      />

      <div ref={containerRef} className="relative">
        <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-line dark:bg-line-dark lg:left-1/2" />
        <motion.div
          style={{ scaleY: spineScale }}
          className="absolute left-4 top-0 h-full w-px origin-top -translate-x-1/2 bg-marigold lg:left-1/2"
        />

        <div className="flex flex-col gap-12 lg:gap-16">
          {ACHIEVEMENT_TIMELINE.map((entry, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={entry.index} className="relative">
                <span className="absolute left-4 top-1 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-marigold text-white ring-4 ring-paper dark:ring-paper-dark lg:left-1/2">
                  <Trophy className="h-3 w-3" />
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                  className={cn(
                    "ml-12 flex flex-col gap-1.5 lg:ml-0 lg:w-[calc(50%-3rem)]",
                    isEven ? "lg:mr-auto lg:text-right" : "lg:ml-auto lg:text-left",
                  )}
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-marigold dark:text-marigold-light">
                    {entry.year}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
                    {entry.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
                    {entry.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
