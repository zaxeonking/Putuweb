import type { Metadata } from "next";
import { getAchievements } from "@/lib/mock-data";
import AchievementSpotlight from "@/components/AchievementSpotlight";
import AchievementCard from "@/components/AchievementCard";
import EmptyState from "@/components/EmptyState";
import { IconTrophy } from "@/components/icons";

export const metadata: Metadata = { title: "Achievements | Class Site" };

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
        Achievement Board
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">
        Recognizing our students
      </h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        A running record of milestones our students and class have hit
        together, big and small.
      </p>

      {achievements.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<IconTrophy className="h-10 w-10" />}
            title="No achievements yet"
            message="Student and class accomplishments will be celebrated here."
          />
        </div>
      ) : (
        <>
          <div className="mt-10">
            <AchievementSpotlight achievements={achievements} />
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
