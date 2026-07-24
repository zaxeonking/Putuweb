"use client";

import { useEffect } from "react";
import type { VideoResource } from "@/lib/types";
import { IconX } from "@/components/icons";

function embedSrc(video: VideoResource): string {
  return video.provider === "youtube"
    ? `https://www.youtube.com/embed/${video.embedId}?autoplay=1`
    : `https://player.vimeo.com/video/${video.embedId}?autoplay=1`;
}

export default function VideoLightbox({ video, onClose }: { video: VideoResource; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-2">
          <h3 className="font-display text-base font-semibold text-white">{video.title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            key={video.id}
            src={embedSrc(video)}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-sm text-white/80">{video.description}</p>
      </div>
    </div>
  );
}
