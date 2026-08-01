import type { Metadata } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import Viewer from "./Viewer";

export const metadata: Metadata = {
  title: "Résumé — Aryaman Jaiswal",
  description: "Résumé of Aryaman Jaiswal.",
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
