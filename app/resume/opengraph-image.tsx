import { GREETING, NAME } from "@/app/lib/site";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/app/lib/og";

const SUB = "My résumé — roles, projects, awards and contact details.";

export const alt = `${GREETING} — ${SUB}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard(SUB);
}
