import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { IconMail } from "@/components/icons";

export const metadata: Metadata = { title: "Contact | Class Site" };

export default function ContactPage() {
  return (
    <div className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
            Get in touch
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Contact</h1>
          <p className="mt-3 max-w-md text-ink-600">
            Questions about the classroom, an event, or anything else? Send us
            a message and we'll get back to you within one to two business
            days.
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700">
              <IconMail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Prefer email?</p>
              <p className="mt-1 text-sm text-ink-600">
                You're welcome to reach out directly — this form routes to the
                same inbox.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
