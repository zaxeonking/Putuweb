import type { Achievement } from "@/lib/types";
import { ACHIEVEMENT_ICONS, IconTrophy } from "./icons";
import { formatDate } from "./CategoryBadge";
import EmptyState from "./EmptyState";

export default function AchievementBadgeGrid({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) {
    return (
      <EmptyState
        icon={<IconTrophy className="h-8 w-8" />}
        title="No achievements yet"
        message="Awards and recognitions will appear here as they're recorded."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-5 pb-2">
      {achievements.map((achievement) => {
        const Icon = ACHIEVEMENT_ICONS[achievement.icon];
        return (
          <div key={achievement.id} className="group relative">
            <div className="flex h-14 w-14 cursor-default items-center justify-center rounded-full bg-brass-50 text-brass-600 shadow-card transition-transform duration-200 group-hover:scale-110">
              <Icon className="h-6 w-6" />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-52 -translate-x-1/2 rounded-lg border border-ink-100 bg-white p-3 text-left opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100">
              <p className="font-display text-sm font-semibold text-ink-900">{achievement.title}</p>
              <p className="mt-1 text-xs text-ink-500">{achievement.description}</p>
              <p className="mt-1 text-[11px] text-ink-400">{formatDate(achievement.date)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
