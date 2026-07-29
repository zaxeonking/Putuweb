import { PageIntro } from "@/components/ui/PageIntro";
import { CLEANING_DUTY_PAGE } from "@/lib/constants";

export function CleaningDutyIntro() {
  return (
    <PageIntro eyebrow={CLEANING_DUTY_PAGE.eyebrow} title={CLEANING_DUTY_PAGE.title} lead={CLEANING_DUTY_PAGE.lead} />
  );
}
