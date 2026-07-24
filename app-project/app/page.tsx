import { Suspense } from "react";
import Hero from "@/components/landing/Hero";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import AnnouncementsPreview from "@/components/landing/AnnouncementsPreview";
import NewsPreview from "@/components/landing/NewsPreview";
import AchievementsPreview from "@/components/landing/AchievementsPreview";
import BirthdaySpotlight from "@/components/landing/BirthdaySpotlight";
import CTASection from "@/components/landing/CTASection";
import ScrollReveal from "@/components/ScrollReveal";
import { CardSkeletonGrid, Skeleton } from "@/components/Skeleton";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureHighlights />

      <section className="container-page py-10">
        <ScrollReveal>
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
            <BirthdaySpotlight />
          </Suspense>
        </ScrollReveal>
      </section>

      <section className="container-page py-10">
        <ScrollReveal>
          <Suspense
            fallback={
              <div>
                <Skeleton className="h-8 w-64" />
                <div className="mt-6">
                  <CardSkeletonGrid />
                </div>
              </div>
            }
          >
            <AnnouncementsPreview />
          </Suspense>
        </ScrollReveal>
      </section>

      <section className="container-page py-10">
        <ScrollReveal>
          <Suspense
            fallback={
              <div>
                <Skeleton className="h-8 w-64" />
                <div className="mt-6">
                  <CardSkeletonGrid />
                </div>
              </div>
            }
          >
            <NewsPreview />
          </Suspense>
        </ScrollReveal>
      </section>

      <section className="container-page py-10">
        <ScrollReveal>
          <Suspense
            fallback={
              <div>
                <Skeleton className="h-8 w-64" />
                <div className="mt-6">
                  <CardSkeletonGrid />
                </div>
              </div>
            }
          >
            <AchievementsPreview />
          </Suspense>
        </ScrollReveal>
      </section>

      <CTASection />
    </>
  );
}
