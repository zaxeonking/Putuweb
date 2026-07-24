"use client";

import { useState } from "react";
import clsx from "clsx";
import type { NewsArticle } from "@/lib/types";
import { formatDate } from "./CategoryBadge";
import { IconArrowRight, IconNewspaper } from "./icons";

export default function NewsCard({ article }: { article: NewsArticle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-brass-600">
        <IconNewspaper className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{article.tag}</span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{article.title}</h3>
      <p className="mt-1 text-xs text-ink-500">
        {formatDate(article.date)} · {article.author}
      </p>

      <p className="mt-3 text-sm text-ink-600">{article.excerpt}</p>

      <div
        className={clsx(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="mt-3 text-sm leading-relaxed text-ink-700">{article.content}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brass-700 transition-colors hover:text-brass-800"
      >
        {isOpen ? "Show less" : "Read more"}
        <IconArrowRight
          className={clsx("h-4 w-4 transition-transform duration-300", isOpen && "rotate-90")}
        />
      </button>
    </article>
  );
}
