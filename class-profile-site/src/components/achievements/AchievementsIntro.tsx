import { PageIntro } from "@/components/ui/PageIntro";
import { ACHIEVEMENTS_PAGE } from "@/lib/constants";

export function AchievementsIntro() {
  return (
    <PageIntro eyebrow={ACHIEVEMENTS_PAGE.eyebrow} title={ACHIEVEMENTS_PAGE.title} lead={ACHIEVEMENTS_PAGE.lead} />
  );
}
