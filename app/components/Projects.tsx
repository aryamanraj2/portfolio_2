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
      " — one Siri shortcut in, a locked multi-stop itinerary out. Friends join by code and swipe to vote until the plan commits.",
    ],
  },
  {
    title: "Saldo",
    note: [
      "A student budgeting app that ",
      { b: "reacts to your balance" },
      " — the interface shifts colour as it moves. Receipts scan themselves, and every insight is computed on-device.",
    ],
  },
  {
    title: "AquaSense",
    note: [
      "Aquarium care where ",
      { b: "the classifier owns the verdict" },
      " and the model only explains it. Routable agents read live water telemetry, diagnose fish from a photo, and cart the fix.",
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
