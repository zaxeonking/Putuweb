import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/class", priority: 0.8 },
  { path: "/organization", priority: 0.6 },
  { path: "/members", priority: 0.6 },
  { path: "/schedule", priority: 0.6 },
  { path: "/cleaning-duty", priority: 0.5 },
  { path: "/achievements", priority: 0.6 },
  { path: "/gallery", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
