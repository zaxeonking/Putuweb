import type { Achievement } from "@/lib/types";
import { formatDate } from "./CategoryBadge";
import { ACHIEVEMENT_ICONS } from "./icons";

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = ACHIEVEMENT_ICONS[achievement.icon];

  return (
    <div className="flex gap-4 rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brass-50 text-brass-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-base font-semibold text-ink-900">{achievement.title}</p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-brass-600">
          {achievement.recipient}
        </p>
        <p className="mt-2 text-sm text-ink-600">{achievement.description}</p>
        <p className="mt-2 text-xs text-ink-400">{formatDate(achievement.date)}</p>
      </div>
    </div>
  );
}
