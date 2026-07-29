"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/about/SectionHeading";
import { CertificateCard } from "@/components/achievements/CertificateCard";
import { CertificateModal } from "@/components/achievements/CertificateModal";
import { CERTIFICATES } from "@/lib/constants";
import { Certificate } from "@/types";

export function CertificatesSection() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index="04 — On Record"
        title="Certificates"
        description="The paper trail behind every award — tap a certificate for the full details."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((certificate, i) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            delay={i * 0.06}
            onSelect={setSelected}
          />
        ))}
      </div>

      <CertificateModal certificate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
