import styles from "./Lore.module.css";

type Entry = {
  company: string;
  role: string;
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
    company: "SmartoutMedia",
    role: "Freelance iOS Developer",
    period: "January 2026 - Present",
    note: "Developing a native iOS app from scratch for a Canadian hunting and fishing platform. Owning the build end-to-end, from architecture through shipping it to production on the App Store.",
  },
  {
    company: "NSUT Exam Cell",
    role: "SDE Intern",
    period: "May 2025 - July 2025",
    note: "Built a platform that automated exam scheduling for over 10,000 students, cutting manual paperwork by 70%. Also made a mobile app for staff to manage exam duties and attendance in real time.",
  },
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
          <li className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.role}>{ENTRIES[2].role}</span>
              <span className={styles.period}>{ENTRIES[2].period}</span>
            </div>
            <article className={styles.body}>
              <h3 className={styles.company}>{ENTRIES[2].company}</h3>
              <p className={styles.note}>{ENTRIES[2].note}</p>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
