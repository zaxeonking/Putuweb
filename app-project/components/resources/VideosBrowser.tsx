"use client";

import { useState } from "react";
import type { ResourceSubject, VideoResource } from "@/lib/types";
import VideoCard from "./VideoCard";
import VideoLightbox from "./VideoLightbox";
import EmptyState from "@/components/EmptyState";
import { IconPlay } from "@/components/icons";

export default function VideosBrowser({ videos, subjects }: { videos: VideoResource[]; subjects: ResourceSubject[] }) {
  const [subject, setSubject] = useState<ResourceSubject | "all">("all");
  const [playing, setPlaying] = useState<VideoResource | null>(null);

  const filtered = subject === "all" ? videos : videos.filter((v) => v.subject === subject);

  return (
    <div>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value as ResourceSubject | "all")}
        className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700"
        aria-label="Filter videos by subject"
      >
        <option value="all">All subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState icon={<IconPlay className="h-10 w-10" />} title="No videos in this subject yet" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={() => setPlaying(video)} />
            ))}
          </div>
        )}
      </div>

      {playing && <VideoLightbox video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
