import type { VideoResource } from "@/lib/types";
import { formatDate } from "@/components/CategoryBadge";
import { IconPlay } from "@/components/icons";
import SubjectBadge from "./SubjectBadge";

export default function VideoCard({ video, onPlay }: { video: VideoResource; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white text-left shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        <span className="absolute bottom-2 right-2 rounded bg-ink-950/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {video.durationLabel}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow">
            <IconPlay className="h-6 w-6" />
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <SubjectBadge subject={video.subject} />
        <h3 className="mt-2 font-display text-base font-semibold text-ink-900">{video.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-600">{video.description}</p>
        <span className="mt-3 text-xs text-ink-400">Added {formatDate(video.dateAdded)}</span>
      </div>
    </button>
  );
}
