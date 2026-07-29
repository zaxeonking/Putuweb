import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CleaningDutyIntro } from "@/components/cleaning-duty/CleaningDutyIntro";
import { DutyExplorer } from "@/components/cleaning-duty/DutyExplorer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Cleaning Duty Schedule — ${SITE.name} (${SITE.fullName})`,
  description: "The weekly Monday–Friday cleaning duty roster for PUTU — Class X-7.",
};

export default function CleaningDutyPage() {
  return (
    <>
      <Container>
        <CleaningDutyIntro />
      </Container>

      <section className="rule">
        <Container className="py-16 sm:py-20">
          <DutyExplorer />
        </Container>
      </section>
    </>
  );
}
