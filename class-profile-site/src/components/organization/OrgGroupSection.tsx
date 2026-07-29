"use client";

import { cn } from "@/lib/utils";
import { OrgGroup } from "@/types";
import { SectionHeading } from "@/components/about/SectionHeading";
import { MemberCard } from "@/components/organization/MemberCard";

interface OrgGroupSectionProps {
  group: OrgGroup;
  emphasized?: boolean;
}

export function OrgGroupSection({ group, emphasized = false }: OrgGroupSectionProps) {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index={`${group.index} — ${group.title}`}
        title={group.title}
        description={group.description}
        align="center"
        className="mx-auto"
      />

      <div
        className={cn(
          "mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2",
          emphasized ? "lg:grid-cols-2" : "lg:grid-cols-4",
        )}
      >
        {group.members.map((member, i) => (
          <MemberCard
            key={member.id}
            member={member}
            delay={i * 0.08}
            size={emphasized ? "lg" : "md"}
          />
        ))}
      </div>
    </div>
  );
}
