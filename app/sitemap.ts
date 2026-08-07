import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "./lib/site";
import { APPS } from "./lib/apps";

const resumeStamp = () => {
  try {
    return new Date(statSync(join(process.cwd(), "public", "resume.pdf")).mtimeMs);
  } catch {
    return new Date();
  }
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const resume = resumeStamp();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...APPS.map((app) => ({
      url: `${SITE_URL}/apps/${app.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/resume`,
      lastModified: resume,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resume.pdf`,
      lastModified: resume,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
