import Link from "next/link";
import { getNews } from "@/lib/mock-data";
import NewsCard from "../NewsCard";
import EmptyState from "../EmptyState";
import { IconArrowRight, IconNewspaper } from "../icons";

export default async function NewsPreview() {
  const articles = await getNews();
  const preview = articles.slice(0, 3);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
            Class News
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
            Stories from the classroom
          </h2>
        </div>
        <Link
          href="/news"
          className="hidden flex-shrink-0 items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline-flex"
        >
          View all
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {preview.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<IconNewspaper className="h-8 w-8" />}
            title="No news yet"
            message="New stories will show up here as they're published."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <Link
        href="/news"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ink-900 sm:hidden"
      >
        View all news
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
