import { PageIntro } from "@/components/ui/PageIntro";
import { ORGANIZATION } from "@/lib/constants";

export function OrgIntro() {
  return (
    <PageIntro eyebrow={ORGANIZATION.intro.eyebrow} title={ORGANIZATION.intro.title} lead={ORGANIZATION.intro.lead} />
  );
}
