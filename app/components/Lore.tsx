"use client";

import Emphasis, { type Segment } from "./Emphasis";
import { useRevealed } from "@/app/lib/useRevealed";
import styles from "./Lore.module.css";

type Entry = {
  company: string;
  role: string;
  period: string;
  note: Segment[];
};

const ENTRIES: Entry[] = [
  {
    company: "Bharti Airtel",
    role: "SDE Intern",
    period: "June 2026 - Present",
    note: [
      "Re-architected an internal platform tracking live and historical state across a distributed VM fleet, cutting dashboard query latency by ",
      { kw: "30%" },
      ". Built a guardrailed natural-language layer over it: local LLMs, a read-only ",
      { kw: "text-to-SQL" },
      " agent, and anomaly summaries for provisioning spikes.",
    ],
  },
  {
    company: "SmartoutMedia",
    role: "Freelance iOS Developer",
    period: "January 2026 - Present",
    note: [
      "Built the SmartOut iOS app from scratch in Swift and SwiftUI, now past ",
      { kw: "50K installs" },
      ". It works fully offline across ",
      { kw: "Canada" },
      ", mapping hunting and fishing regulations onto 456 regulatory zones over a bundled SQLite store.",
    ],
  },
  {
    company: "NSUT Exam Cell",
    role: "SDE Intern",
    period: "May 2025 - July 2025",
    note: [
      "Built a platform that automated exam scheduling for ",
      { kw: "10,000+ students" },
      ", cutting manual paperwork by 70%. Shipped ",
      { kw: "NSUTrack" },
      " alongside it, native Android and iOS clients centralizing schedules, attendance, and society notices for 1,500+ students over an offline-first cache.",
    ],
  },
  {
    company: "NSUT, Delhi",
    role: "Bachelors",
    period: "Aug 2024 - Present",
    note: ["surviving Electronics and communications"],
  },
];

export default function Lore({ active = true }: { active?: boolean }) {
  const [note0, on0] = useRevealed<HTMLParagraphElement>();
  const [note1, on1] = useRevealed<HTMLParagraphElement>();
  const [note2, on2] = useRevealed<HTMLParagraphElement>();
  const [note3, on3] = useRevealed<HTMLParagraphElement>();

  return (
    <section
      className={`${styles.lore} ${active ? styles.active : ""}`}
      aria-label="Lore"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Lore</h2>
        </header>
        <ol className={styles.list}>
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[0].role}</span>
              <span className={styles.period}>{ENTRIES[0].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[0].company}</h3>
              <p className={styles.note} ref={note0}>
                <Emphasis parts={ENTRIES[0].note} play={on0} />
              </p>
            </article>
          </li>
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[1].role}</span>
              <span className={styles.period}>{ENTRIES[1].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[1].company}</h3>
              <p className={styles.note} ref={note1}>
                <Emphasis parts={ENTRIES[1].note} play={on1} />
              </p>
            </article>
          </li>
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[2].role}</span>
              <span className={styles.period}>{ENTRIES[2].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[2].company}</h3>
              <p className={styles.note} ref={note2}>
                <Emphasis parts={ENTRIES[2].note} play={on2} />
              </p>
            </article>
          </li>
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[3].role}</span>
              <span className={styles.period}>{ENTRIES[3].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[3].company}</h3>
              <p className={styles.note} ref={note3}>
                <Emphasis parts={ENTRIES[3].note} play={on3} />
              </p>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
