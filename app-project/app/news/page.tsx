import type { Metadata } from "next";
import { getNews } from "@/lib/mock-data";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import { IconNewspaper } from "@/components/icons";

export const metadata: Metadata = { title: "News | Class Site" };

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">
        Class News
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">
        Stories from the classroom
      </h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Updates on what students have been working on and celebrating lately.
      </p>

      <div className="mt-10">
        {articles.length === 0 ? (
          <EmptyState
            icon={<IconNewspaper className="h-10 w-10" />}
            title="No news yet"
            message="New stories will show up here as they're published."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
