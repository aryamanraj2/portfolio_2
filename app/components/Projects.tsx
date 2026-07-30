"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";

type Part = string | { b: string };

type Project = {
  title: string;
  platform: string;
  note: Part[];
  stack: string[];
};

const PROJECTS: Project[] = [
  {
    title: "Wandr",
    platform: "iOS",
    note: [
      "Turns a group chat into ",
      { b: "a decided night out" },
      " — one Siri shortcut in, a locked multi-stop itinerary out. Friends join by code and swipe to vote until the plan commits.",
    ],
    stack: ["Swift", "Foundation Models", "App Intents", "Supabase Realtime"],
  },
  {
    title: "Saldo",
    platform: "iOS",
    note: [
      "A student budgeting app that ",
      { b: "reacts to your balance" },
      " — the interface shifts colour as it moves. Receipts scan themselves, and every insight is computed on-device.",
    ],
    stack: ["Swift 6", "SwiftUI", "Vision", "Foundation Models"],
  },
  {
    title: "AquaSense",
    platform: "iOS · Android",
    note: [
      "Aquarium care where ",
      { b: "the classifier owns the verdict" },
      " and the model only explains it. Routable agents read live water telemetry, diagnose fish from a photo, and cart the fix.",
    ],
    stack: ["Random Forest", "Gemini", "LangChain", "Flask"],
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
  const [open, setOpen] = useState(0);

  return (
    <section
      className={`${styles.projects} ${active ? styles.active : ""}`}
      aria-label="Projects"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Projects</h2>
          <p className={styles.count}>Selected · 03</p>
        </header>
        <div className={styles.board} onMouseLeave={() => setOpen(0)}>
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
                  <span className={styles.platform}>{project.platform}</span>
                </span>
                <span className={styles.reveal}>
                  <span className={styles.revealInner}>
                    <span className={styles.detail}>
                      <span className={styles.note}>
                        {renderNote(project.note)}
                      </span>
                      <span className={styles.stack}>
                        {project.stack.map((item) => (
                          <span key={item} className={styles.chip}>
                            {item}
                          </span>
                        ))}
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
