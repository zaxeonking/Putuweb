import type { Metadata } from "next";
import { getVideoResources, RESOURCE_SUBJECTS } from "@/lib/resources-data";
import VideosBrowser from "@/components/resources/VideosBrowser";

export const metadata: Metadata = { title: "Video Gallery | Class Site" };

export default async function VideosPage() {
  const videos = await getVideoResources();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">Learning Materials</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Video Gallery</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Short instructional videos to support each subject. Tap any thumbnail to watch in an embedded
        player.
      </p>

      <div className="mt-8">
        <VideosBrowser videos={videos} subjects={RESOURCE_SUBJECTS} />
      </div>
    </div>
  );
}
