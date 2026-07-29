import { SectionHeading } from "@/components/about/SectionHeading";
import { ClassInfoCard } from "@/components/about/ClassInfoCard";
import { ContactCard } from "@/components/about/ContactCard";
import { GenderRatioBar } from "@/components/about/GenderRatioBar";
import { CLASS_INFO_CARDS, CLASS_INFO_SECTION, CONTACT_CHANNELS } from "@/lib/constants";

export function ClassInfoSection() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        index={CLASS_INFO_SECTION.index}
        title={CLASS_INFO_SECTION.title}
        description={CLASS_INFO_SECTION.lead}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CLASS_INFO_CARDS.map((item, i) => (
          <ClassInfoCard key={item.label} item={item} delay={i * 0.06} />
        ))}
      </div>

      <GenderRatioBar />

      <div id="contact" className="flex scroll-mt-24 flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted dark:text-muted-dark">
          Contact Information
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONTACT_CHANNELS.map((channel, i) => (
            <ContactCard key={channel.label} channel={channel} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}
