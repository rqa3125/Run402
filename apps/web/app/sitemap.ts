import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/docs",
  "/pricing",
  "/blog",
  "/changelog",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
