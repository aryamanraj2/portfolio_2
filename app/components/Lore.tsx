"use client";

import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react";
import styles from "./Lore.module.css";

const BONE = "#ffffe3";
const BONE_DIM = "rgba(255, 255, 227, 0.68)";

const CHAPTERS = [
  { role: "Undergraduate", meta: "University · 2022 — Now" },
  { role: "Freelance — iOS & Android", meta: "Independent · 2023 — Now" },
];

const template = templateExtend(TemplateName.Metro, {
  colors: [BONE, BONE_DIM, BONE_DIM, BONE_DIM, BONE_DIM],
  branch: {
    lineWidth: 2,
    spacing: 34,
    label: { display: false },
  },
  commit: {
    spacing: 62,
    dot: { size: 6, strokeWidth: 0 },
    message: {
      display: true,
      displayAuthor: false,
      displayHash: false,
      color: BONE,
    },
  },
});

const label = (role: string, meta: string) => (
  <foreignObject x={2} y={-16} width={520} height={36}>
    <div className={styles.msg}>
      <span className={styles.role}>{role}</span>
      <span className={styles.sep}>·</span>
      <span className={styles.meta}>{meta}</span>
    </div>
  </foreignObject>
);

export default function Lore() {
  return (
    <div className={styles.canvas}>
      <Gitgraph options={{ template, author: "" }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit({ subject: "", renderMessage: () => <></> });

          CHAPTERS.forEach((chapter, i) => {
            const branch = gitgraph.branch({ name: `chapter-${i}`, from: main });
            branch.commit({
              subject: chapter.role,
              renderMessage: () => label(chapter.role, chapter.meta),
            });
          });

          main.commit({ subject: "", renderMessage: () => <></> });
        }}
      </Gitgraph>
    </div>
  );
}
