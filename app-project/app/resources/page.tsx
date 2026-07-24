import type { Metadata } from "next";
import Link from "next/link";
import { getAssignments, getLearningMaterials, getVideoResources } from "@/lib/resources-data";
import type { ResourceSearchResult } from "@/lib/types";
import ResourceSearch from "@/components/resources/ResourceSearch";
import RecommendedMaterials from "@/components/resources/RecommendedMaterials";
import { IconClipboardCheck, IconFolder, IconPlay, IconCheckCircle } from "@/components/icons";

export const metadata: Metadata = { title: "Learning Materials & Resources | Class Site" };

const QUICK_LINKS = [
  {
    href: "/resources/assignments",
    label: "Assignments",
    description: "Due dates, descriptions, and attachments for every current assignment.",
    icon: IconClipboardCheck,
  },
  {
    href: "/resources/homework",
    label: "Homework Tracker",
    description: "Check off completed homework and watch your progress bar fill in.",
    icon: IconCheckCircle,
  },
  {
    href: "/resources/materials",
    label: "Materials Library",
    description: "Worksheets, readings, and study guides organized by subject.",
    icon: IconFolder,
  },
  {
    href: "/resources/videos",
    label: "Video Gallery",
    description: "Short instructional videos to support each unit.",
    icon: IconPlay,
  },
];

export default async function ResourcesHubPage() {
  const [assignments, materials, videos] = await Promise.all([
    getAssignments(),
    getLearningMaterials(),
    getVideoResources(),
  ]);

  const searchIndex: ResourceSearchResult[] = [
    ...assignments.map((a) => ({
      id: a.id,
      kind: "assignment" as const,
      title: a.title,
      subject: a.subject,
      snippet: a.description,
    })),
    ...materials.map((m) => ({
      id: m.id,
      kind: "material" as const,
      title: m.title,
      subject: m.subject,
      snippet: m.description,
    })),
    ...videos.map((v) => ({
      id: v.id,
      kind: "video" as const,
      title: v.title,
      subject: v.subject,
      snippet: v.description,
    })),
  ];

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brass-600">Learning Materials</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Resources</h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Everything for class in one place: assignments, homework tracking, downloadable materials, and
        instructional videos.
      </p>

      <div className="mt-8">
        <ResourceSearch index={searchIndex} />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <link.icon className="h-7 w-7 text-brass-500" />
            <h2 className="mt-3 font-display text-base font-semibold text-ink-900">{link.label}</h2>
            <p className="mt-1 text-sm text-ink-500">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-14">
        <RecommendedMaterials materials={materials} />
      </div>
    </div>
  );
}
