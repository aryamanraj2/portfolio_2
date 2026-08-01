import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "./lib/site";

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
    {
      url: `${SITE_URL}/resume`,
      lastModified: resume,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
