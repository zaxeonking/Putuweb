import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ScheduleIntro } from "@/components/schedule/ScheduleIntro";
import { ScheduleExplorer } from "@/components/schedule/ScheduleExplorer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Lesson Schedule — ${SITE.name} (${SITE.fullName})`,
  description: "The weekly Monday–Friday lesson schedule for PUTU — Class X-7.",
};

export default function SchedulePage() {
  return (
    <>
      <Container>
        <ScheduleIntro />
      </Container>

      <section className="rule">
        <Container className="py-16 sm:py-20">
          <ScheduleExplorer />
        </Container>
      </section>
    </>
  );
}
