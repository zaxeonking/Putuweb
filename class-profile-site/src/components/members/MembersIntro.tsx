import { PageIntro } from "@/components/ui/PageIntro";
import { MEMBERS_PAGE } from "@/lib/constants";

export function MembersIntro() {
  return <PageIntro eyebrow={MEMBERS_PAGE.eyebrow} title={MEMBERS_PAGE.title} lead={MEMBERS_PAGE.lead} />;
}
