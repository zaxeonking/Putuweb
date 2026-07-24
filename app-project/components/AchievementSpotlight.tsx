"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Achievement } from "@/lib/types";
import { formatDate } from "./CategoryBadge";
import { ACHIEVEMENT_ICONS } from "./icons";

const ROTATE_MS = 5000;

export default function AchievementSpotlight({ achievements }: { achievements: Achievement[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || achievements.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % achievements.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, achievements.length]);

  if (achievements.length === 0) return null;

  const current = achievements[index];
  const Icon = ACHIEVEMENT_ICONS[current.icon];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-brass-200 bg-gradient-to-br from-brass-50 via-white to-white p-6 sm:p-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brass-600">
        Spotlight
      </p>

      <div key={current.id} className="mt-3 flex animate-pop-in items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brass-500 text-white shadow-card">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">{current.title}</h2>
          <p className="mt-0.5 text-sm font-semibold text-brass-700">{current.recipient}</p>
          <p className="mt-2 max-w-lg text-sm text-ink-600">{current.description}</p>
          <p className="mt-2 text-xs text-ink-400">{formatDate(current.date)}</p>
        </div>
      </div>

      {achievements.length > 1 && (
        <div className="mt-6 flex items-center gap-2">
          {achievements.map((achievement, i) => (
            <button
              key={achievement.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show achievement ${i + 1} of ${achievements.length}`}
              aria-current={i === index}
              className={clsx(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-brass-500" : "w-1.5 bg-brass-200 hover:bg-brass-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
