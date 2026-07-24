import Link from "next/link";
import { getAchievements } from "@/lib/mock-data";
import AchievementCard from "../AchievementCard";
import EmptyState from "../EmptyState";
import { IconArrowRight, IconTrophy } from "../icons";

export default async function AchievementsPreview() {
  const achievements = await getAchievements();
  const preview = achievements.slice(0, 3);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
            Achievement Board
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
            Recognizing our students
          </h2>
        </div>
        <Link
          href="/achievements"
          className="hidden flex-shrink-0 items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline-flex"
        >
          View all
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {preview.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<IconTrophy className="h-8 w-8" />}
            title="No achievements yet"
            message="Student and class accomplishments will be celebrated here."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}

      <Link
        href="/achievements"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:hidden"
      >
        View the full achievement board
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
