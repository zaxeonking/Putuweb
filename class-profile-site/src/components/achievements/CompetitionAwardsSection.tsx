"use client";

import { SectionHeading } from "@/components/about/SectionHeading";
import { AwardCard } from "@/components/achievements/AwardCard";
import { COMPETITION_AWARDS } from "@/lib/constants";

export function CompetitionAwardsSection() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index="03 — The Ledger"
        title="Competition Awards"
        description="Every competition X-7 has entered and medaled in — school level and beyond."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {COMPETITION_AWARDS.map((award, i) => (
          <AwardCard key={award.id} award={award} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
}
