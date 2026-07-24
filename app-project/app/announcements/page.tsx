import type { Metadata } from "next";
import { getAnnouncements } from "@/lib/mock-data";
import AnnouncementCard from "@/components/AnnouncementCard";
import EmptyState from "@/components/EmptyState";
import { IconMegaphone } from "@/components/icons";

export const metadata: Metadata = { title: "Announcements | Class Site" };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
        Stay in the loop
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Announcements</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        The latest updates for our class, newest first. Tap any announcement to
        read the full details.
      </p>

      <div className="mt-10">
        {announcements.length === 0 ? (
          <EmptyState
            icon={<IconMegaphone className="h-10 w-10" />}
            title="No announcements yet"
            message="Check back soon — new updates will appear here as soon as they're posted."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
