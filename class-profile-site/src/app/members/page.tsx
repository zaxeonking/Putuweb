import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MembersIntro } from "@/components/members/MembersIntro";
import { MembersExplorer } from "@/components/members/MembersExplorer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Members — ${SITE.name} (${SITE.fullName})`,
  description: "The full roll call of PUTU — Class X-7 — searchable by name and filterable by attendance number.",
};

export default function MembersPage() {
  return (
    <>
      <Container>
        <MembersIntro />
      </Container>

      <section className="rule">
        <Container className="py-16 sm:py-20">
          <MembersExplorer />
        </Container>
      </section>
    </>
  );
}
