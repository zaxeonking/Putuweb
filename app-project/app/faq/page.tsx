import type { Metadata } from "next";
import { getFaqs } from "@/lib/mock-data";
import FaqAccordion from "@/components/FaqAccordion";
import EmptyState from "@/components/EmptyState";
import { IconHelpCircle } from "@/components/icons";

export const metadata: Metadata = { title: "FAQ | Class Site" };

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
        Answers, fast
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Quick answers to the questions families ask us most often. Don't see
        yours? Reach out through the contact page.
      </p>

      <div className="mt-10 max-w-3xl">
        {faqs.length === 0 ? (
          <EmptyState
            icon={<IconHelpCircle className="h-10 w-10" />}
            title="No questions yet"
            message="FAQ content will appear here once it's added."
          />
        ) : (
          <FaqAccordion items={faqs} />
        )}
      </div>
    </div>
  );
}
