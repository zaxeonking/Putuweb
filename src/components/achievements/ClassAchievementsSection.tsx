"use client";

import { SectionHeading } from "@/components/about/SectionHeading";
import { TrophyCard } from "@/components/achievements/TrophyCard";
import { ACHIEVEMENTS } from "@/lib/constants";

export function ClassAchievementsSection() {
  const classAchievements = ACHIEVEMENTS.filter((a) => a.scope === "class");

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index="01 — As One Class"
        title="Class Achievements"
        description="Wins that belong to the whole roll call, not just one name on it."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {classAchievements.map((achievement, i) => (
          <TrophyCard key={achievement.id} achievement={achievement} delay={i * 0.06} />
        ))}
      </div>
    </div>
  );
}
