import Link from "next/link";
import { getAnnouncements } from "@/lib/mock-data";
import AnnouncementCard from "../AnnouncementCard";
import EmptyState from "../EmptyState";
import { IconArrowRight, IconMegaphone } from "../icons";

export default async function AnnouncementsPreview() {
  const announcements = await getAnnouncements();
  const preview = announcements.slice(0, 3);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
            Latest Announcements
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
            What's happening now
          </h2>
        </div>
        <Link
          href="/announcements"
          className="hidden flex-shrink-0 items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline-flex"
        >
          View all
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {preview.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<IconMegaphone className="h-8 w-8" />}
            title="No announcements yet"
            message="Check back soon for the latest updates."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}

      <Link
        href="/announcements"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:hidden"
      >
        View all announcements
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
