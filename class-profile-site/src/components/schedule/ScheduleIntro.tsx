import { PageIntro } from "@/components/ui/PageIntro";
import { SCHEDULE_PAGE } from "@/lib/constants";

export function ScheduleIntro() {
  return <PageIntro eyebrow={SCHEDULE_PAGE.eyebrow} title={SCHEDULE_PAGE.title} lead={SCHEDULE_PAGE.lead} />;
}
