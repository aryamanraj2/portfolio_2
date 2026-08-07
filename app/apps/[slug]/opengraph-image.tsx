import { APPS, bySlug } from "@/app/lib/apps";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/app/lib/og";

export const alt = "App spec sheet";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return APPS.map((app) => ({ slug: app.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = bySlug(slug);

  return ogCard(app ? app.claim : "", app ? app.title : "");
}
