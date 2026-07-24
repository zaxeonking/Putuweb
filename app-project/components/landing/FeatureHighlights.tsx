import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import {
  IconMegaphone,
  IconNewspaper,
  IconTrophy,
  IconHelpCircle,
} from "../icons";

const FEATURES = [
  {
    href: "/announcements",
    icon: IconMegaphone,
    title: "Announcements",
    description: "Timely updates on schedules, events, and anything families need to know.",
  },
  {
    href: "/news",
    icon: IconNewspaper,
    title: "Class News",
    description: "Stories and highlights from what students have been working on lately.",
  },
  {
    href: "/achievements",
    icon: IconTrophy,
    title: "Achievements",
    description: "A running record of the milestones our students and class hit together.",
  },
  {
    href: "/faq",
    icon: IconHelpCircle,
    title: "Answers, Fast",
    description: "Quick answers to the questions families ask us most often.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="container-page py-16">
      <ScrollReveal>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
            What's here
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900">
            Everything about our classroom, organized
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.href} delayMs={i * 80}>
            <Link
              href={feature.href}
              className="group flex h-full flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:border-brass-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 text-ink-700 transition-colors group-hover:bg-brass-50 group-hover:text-brass-700">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-ink-600">{feature.description}</p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
