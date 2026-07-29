import { PageIntro } from "@/components/ui/PageIntro";
import { ABOUT } from "@/lib/constants";

export function AboutIntro() {
  return <PageIntro eyebrow={ABOUT.intro.eyebrow} title={ABOUT.intro.title} lead={ABOUT.intro.lead} />;
}
