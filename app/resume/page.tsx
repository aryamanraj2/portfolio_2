import type { Metadata } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import Viewer from "./Viewer";
import { NAME } from "@/app/lib/site";

const SUMMARY = `Résumé of ${NAME} — iOS and Android developer. Roles, projects, awards and contact details, viewable in the browser or downloadable as a PDF.`;

export const metadata: Metadata = {
  title: "Résumé",
  description: SUMMARY,
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    type: "profile",
    url: "/resume",
    title: `Résumé — ${NAME}`,
    description: SUMMARY,
  },
  twitter: {
    card: "summary_large_image",
    title: `Résumé — ${NAME}`,
    description: SUMMARY,
  },
};

const FILE = "/resume.pdf";
const DOWNLOAD_AS = "aryaman-jaiswal-resume.pdf";

const stamp = () => {
  try {
    const { mtimeMs } = statSync(join(process.cwd(), "public", "resume.pdf"));
    return Math.floor(mtimeMs).toString(36);
  } catch {
    return "";
  }
};

export default function ResumePage() {
  const version = stamp();

  return (
    <Viewer
      file={version ? `${FILE}?v=${version}` : FILE}
      downloadAs={DOWNLOAD_AS}
    />
  );
}
