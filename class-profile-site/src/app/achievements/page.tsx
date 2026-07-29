import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AchievementsIntro } from "@/components/achievements/AchievementsIntro";
import { AchievementsStats } from "@/components/achievements/AchievementsStats";
import { ClassAchievementsSection } from "@/components/achievements/ClassAchievementsSection";
import { StudentAchievementsSection } from "@/components/achievements/StudentAchievementsSection";
import { CompetitionAwardsSection } from "@/components/achievements/CompetitionAwardsSection";
import { CertificatesSection } from "@/components/achievements/CertificatesSection";
import { AchievementTimelineSection } from "@/components/achievements/AchievementTimelineSection";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Achievements — ${SITE.name} (${SITE.fullName})`,
  description: "Class achievements, student achievements, competition awards, and certificates earned by PUTU — Class X-7.",
};

export default function AchievementsPage() {
  return (
    <>
      <Container>
        <AchievementsIntro />
      </Container>

      <section className="rule">
        <Container className="py-16 sm:py-20">
          <AchievementsStats />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <ClassAchievementsSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <StudentAchievementsSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <CompetitionAwardsSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <CertificatesSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <AchievementTimelineSection />
        </Container>
      </section>
    </>
  );
}
