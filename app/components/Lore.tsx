import styles from "./Lore.module.css";

type Entry = {
  company: string;
  role: string;
  period: string;
  note: string;
};

type Achievement = {
  title: string;
  period: string;
  note: string;
};

const ENTRIES: Entry[] = [
  {
    company: "Bharti Airtel",
    role: "SDE Intern",
    period: "June 2026 - Present",
    note: "Building an internal platform for monitoring cloud infrastructure. Optimized the backend for faster dashboards and built an AI assistant that turns plain-English questions into safe database queries.",
  },
  {
    company: "NSUT Exam Cell",
    role: "SDE Intern",
    period: "May 2025 - July 2025",
    note: "Built a platform that automated exam scheduling for over 10,000 students, cutting manual paperwork by 70%. Also made a mobile app for staff to manage exam duties and attendance in real time.",
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Achievement One",
    period: "Late 2025",
    note: "A milestone from the stretch between internships. Replace this with the exact title, result, and proof point.",
  },
  {
    title: "Achievement Two",
    period: "Early 2026",
    note: "A second highlight branching from the same point in the timeline, placed to read as part of the same chapter.",
  },
  {
    title: "Achievement Three",
    period: "Spring 2026",
    note: "A third achievement that completes the cluster before the timeline continues into the next internship.",
  },
];

const BRANCH_PATHS = [
  "M0 43 C82 43 126 2 194 2 C238 2 262 13 300 13",
  "M0 43 C84 43 138 43 300 43",
  "M0 43 C82 43 126 84 194 84 C238 84 262 73 300 73",
];

export default function Lore({ active = true }: { active?: boolean }) {
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
              <p className={styles.note}>{ENTRIES[0].note}</p>
            </article>
          </li>
          <li className={styles.achievementNode}>
            <span className={styles.origin} aria-hidden="true" />
            <div className={styles.achievementMeta}>
              <span className={styles.role}>Achievements</span>
              <span className={styles.period}>Between chapters</span>
            </div>
            <ul className={styles.achievements}>
              {ACHIEVEMENTS.map((achievement, i) => (
                <li
                  key={achievement.title}
                  className={styles.achievement}
                >
                  <svg
                    className={styles.branch}
                    viewBox="0 0 300 86"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d={BRANCH_PATHS[i]} />
                  </svg>
                  <article className={styles.achievementCard}>
                    <span className={styles.achievementPeriod}>
                      {achievement.period}
                    </span>
                    <h3 className={styles.achievementTitle}>
                      {achievement.title}
                    </h3>
                    <p className={styles.achievementNote}>
                      {achievement.note}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </li>
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[1].role}</span>
              <span className={styles.period}>{ENTRIES[1].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[1].company}</h3>
              <p className={styles.note}>{ENTRIES[1].note}</p>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
