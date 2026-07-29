"use client";

import { motion } from "framer-motion";
import { Images, Layers, Star, CalendarClock } from "lucide-react";
import { GALLERY_CATEGORIES, GALLERY_PHOTOS } from "@/lib/constants";

export function GalleryStats() {
  const featuredCount = GALLERY_PHOTOS.filter((p) => p.featured).length;
  const latest = GALLERY_PHOTOS[GALLERY_PHOTOS.length - 1];

  const stats = [
    { index: "01", icon: Images, label: "Photos Logged", value: String(GALLERY_PHOTOS.length) },
    { index: "02", icon: Layers, label: "Categories", value: String(GALLERY_CATEGORIES.length - 1) },
    { index: "03", icon: Star, label: "Featured Frames", value: String(featuredCount) },
    { index: "04", icon: CalendarClock, label: "Latest Entry", value: latest.date },
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
