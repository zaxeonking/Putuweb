import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AboutIntro } from "@/components/about/AboutIntro";
import { ClassInfoSection } from "@/components/about/ClassInfoSection";
import { HistorySection } from "@/components/about/HistorySection";
import { VisionSection } from "@/components/about/VisionSection";
import { MissionSection } from "@/components/about/MissionSection";
import { PhilosophySection } from "@/components/about/PhilosophySection";
import { MottoSection } from "@/components/about/MottoSection";
import { TimelineSection } from "@/components/about/TimelineSection";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About — ${SITE.name} (${SITE.fullName})`,
  description: "The history, vision, mission, and philosophy behind PUTU — Class X-7.",
};

export default function AboutClassPage() {
  return (
    <>
      <Container>
        <AboutIntro />
      </Container>

      <section id="class-information" className="rule scroll-mt-16">
        <Container className="py-20 sm:py-28">
          <ClassInfoSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <HistorySection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <VisionSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <MissionSection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <PhilosophySection />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <MottoSection />
        </Container>
      </section>

      <section id="timeline" className="rule scroll-mt-16">
        <Container className="py-20 sm:py-28">
          <TimelineSection />
        </Container>
      </section>
    </>
  );
}
