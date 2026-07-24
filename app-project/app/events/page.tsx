import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events | Class Site" };

export default function EventsPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Events</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Upcoming events will appear here once the events module is built.
      </p>
    </div>
  );
}
