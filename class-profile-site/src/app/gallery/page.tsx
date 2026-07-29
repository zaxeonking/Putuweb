import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GalleryIntro } from "@/components/gallery/GalleryIntro";
import { GalleryStats } from "@/components/gallery/GalleryStats";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Gallery — ${SITE.name} (${SITE.fullName})`,
  description: "A categorized, filterable photo gallery of PUTU — Class X-7 — field days, gatherings, trips, and candid moments.",
};

export default function GalleryPage() {
  return (
    <>
      <Container>
        <GalleryIntro />
      </Container>

      <section className="rule">
        <Container className="py-16 sm:py-20">
          <GalleryStats />
        </Container>
      </section>

      <section className="rule">
        <Container className="py-20 sm:py-28">
          <GalleryGrid />
        </Container>
      </section>
    </>
  );
}
