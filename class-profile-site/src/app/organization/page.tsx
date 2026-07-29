import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OrgIntro } from "@/components/organization/OrgIntro";
import { TeacherSpotlight } from "@/components/organization/TeacherSpotlight";
import { OrgGroupSection } from "@/components/organization/OrgGroupSection";
import { ORGANIZATION, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Organization Structure — ${SITE.name} (${SITE.fullName})`,
  description: "Meet the homeroom teacher, class leadership, and section coordinators behind PUTU — Class X-7.",
};

export default function OrganizationPage() {
  return (
    <>
      <Container>
        <OrgIntro />
      </Container>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <TeacherSpotlight />
        </Container>
      </section>

      {ORGANIZATION.groups.map((group) => (
        <section key={group.id} className="rule">
          <Container className="py-20 sm:py-28">
            <OrgGroupSection group={group} emphasized={group.id === "leadership"} />
          </Container>
        </section>
      ))}
    </>
  );
}
