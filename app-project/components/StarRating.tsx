"use client";

import { useState } from "react";
import clsx from "clsx";
import { IconStar } from "./icons";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export default function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const iconSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const display = hovered ?? value;

  return (
    <div
      role="radiogroup"
      aria-label="Rating out of 5 stars"
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onClick={() => onChange(star)}
          className="rounded p-0.5 text-brass-400 transition-transform hover:scale-110"
        >
          <IconStar
            className={clsx(iconSize, star <= display ? "fill-brass-400 text-brass-500" : "text-ink-200")}
          />
        </button>
      ))}
    </div>
  );
}
