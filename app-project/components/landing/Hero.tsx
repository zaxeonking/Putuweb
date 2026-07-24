import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowRight, IconSparkles } from "../icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-white to-ink-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass-100 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-ink-100 blur-3xl" aria-hidden="true" />

      <div className="container-page relative py-20 sm:py-28">
        <ScrollReveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-200 bg-brass-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass-700">
            <IconSparkles className="h-3.5 w-3.5" />
            Welcome to our class
          </span>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Our class, all in one place.
          </h1>
        </ScrollReveal>

        <ScrollReveal delayMs={200}>
          <p className="mt-5 max-w-xl text-lg text-ink-600">
            Announcements, news, achievements, and upcoming events — everything
            families need to stay connected with what's happening in our
            classroom, in one friendly home base.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={300}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-ink-800"
            >
              See what's new
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
            >
              Get in touch
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
