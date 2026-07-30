"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";

type Part = string | { b: string };

type Project = {
  title: string;
  note: Part[];
};

const PROJECTS: Project[] = [
  {
    title: "Wandr",
    note: [
      "Turns a group chat into ",
      { b: "a decided night out" },
      ". A seven-stage pipeline pulls intent from a Siri summary, researches live venues, and resolves conflicts down a constraint ladder that relaxes budget before it ever touches dietary or accessibility. The model only ranks; deterministic code alone mints the plan, and the chat itself is never stored.",
    ],
  },
  {
    title: "Saldo",
    note: [
      "A student budgeting app that ",
      { b: "reacts to your balance" },
      " — a theming engine maps what is left to a palette and repaints the whole interface as the number moves. Receipts are read straight off the camera, goal images are cut from their background on device, and every insight is computed against a store that never leaves the phone.",
    ],
  },
  {
    title: "AquaSense",
    note: [
      "Aquarium care where ",
      { b: "the classifier owns the verdict" },
      " and the model only explains it — water readings are scored first, so the language layer can phrase a result but never invent one. Three routable specialists split the work: live telemetry, image diagnosis from a photo of the fish, and a remediation cart assembled from whatever just got flagged.",
    ],
  },
];

const renderNote = (parts: Part[]) =>
  parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <b key={i} className={styles.mark}>
        {part.b}
      </b>
    )
  );

export default function Projects({ active = true }: { active?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className={`${styles.projects} ${active ? styles.active : ""}`}
      aria-label="Projects"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Projects</h2>
        </header>
        <div className={styles.board} onMouseLeave={() => setOpen(null)}>
          {PROJECTS.map((project, index) => (
            <button
              key={project.title}
              type="button"
              className={`${styles.row} ${index === open ? styles.open : ""}`}
              aria-expanded={index === open}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              onClick={() => setOpen(index)}
            >
              <span className={styles.index}>
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className={styles.body}>
                <span className={styles.head}>
                  <span className={styles.name}>{project.title}</span>
                </span>
                <span className={styles.reveal}>
                  <span className={styles.revealInner}>
                    <span className={styles.detail}>
                      <span className={styles.note}>
                        {renderNote(project.note)}
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))}
          <button type="button" className={styles.more}>
            <span className={styles.moreLabel}>View more</span>
            <span className={styles.moreIcon} aria-hidden="true">
              <ArrowUpRight size={17} strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
