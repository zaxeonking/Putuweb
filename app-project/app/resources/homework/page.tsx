import type { Metadata } from "next";
import { getHomeworkTracker } from "@/lib/resources-data";
import HomeworkTracker from "@/components/resources/HomeworkTracker";

export const metadata: Metadata = { title: "Homework Tracker | Class Site" };

export default async function HomeworkPage() {
  const rows = await getHomeworkTracker();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">Learning Materials</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Homework Tracker</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Check off homework as you finish it. Your progress is saved on this device, and each assignment
        links back to its full details.
      </p>

      <div className="mt-8 max-w-2xl">
        <HomeworkTracker initialRows={rows} />
      </div>
    </div>
  );
}
