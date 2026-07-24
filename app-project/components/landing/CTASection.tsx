import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowRight } from "../icons";

export default function CTASection() {
  return (
    <section className="container-page pb-20">
      <ScrollReveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-ink-900 px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Questions, feedback, or just want to say hi?
            </h2>
            <p className="mt-2 max-w-md text-sm text-ink-200">
              We'd love to hear from you. Reach out through the contact form
              and we'll get back to you soon.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-brass-50"
          >
            Contact us
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
