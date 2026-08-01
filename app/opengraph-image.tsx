import { GREETING, PITCH } from "./lib/site";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "./lib/og";

export const alt = `${GREETING} — ${PITCH}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard(PITCH);
}
