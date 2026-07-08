import styles from "./Lore.module.css";

type Kind = "experience" | "education" | "achievement";

type Entry = {
  kind: Kind;
  title: string;
  org?: string;
  period: string;
  note?: string;
};

const ENTRIES: Entry[] = [
  {
    kind: "achievement",
    title: "Shipped 3 apps to the App Store",
    period: "2025",
    note: "Native iOS releases with on-device AI, live for real users.",
  },
  {
    kind: "achievement",
    title: "Best Mobile App — National Hackathon",
    period: "2024",
    note: "Built and demoed a working prototype in 36 hours.",
  },
  {
    kind: "experience",
    title: "Freelance — iOS & Android",
    org: "Independent",
    period: "2023 — Now",
    note: "Native apps, the AI pipelines inside them, and the backends behind them.",
  },
  {
    kind: "experience",
    title: "Mobile Engineer Intern",
    org: "Early-stage Startup",
    period: "2023",
    note: "Owned features across the mobile client and API.",
  },
  {
    kind: "education",
    title: "B.Tech, Computer Science",
    org: "University",
    period: "2022 — Now",
    note: "Systems, machine learning, and a lot of side projects.",
  },
];

export default function Lore({ active = true }: { active?: boolean }) {
  return (
    <section
      className={`${styles.lore} ${active ? styles.active : ""}`}
      aria-label="Lore"
    >
      <div className={styles.inner}>
        <h2 className={styles.title}>Lore</h2>
        <div className={styles.timeline}>
          <span className={styles.spine} aria-hidden="true" />

          <svg width="0" height="0">
            <defs>
              <marker
                id="loreArrowhead"
                viewBox="0 0 8 8"
                refX="6.5"
                refY="4"
                markerWidth="5.5"
                markerHeight="5.5"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L8 4 L0 8 Z" fill="rgba(255, 255, 227, 0.85)" />
              </marker>
            </defs>
          </svg>

          {ENTRIES.map((entry, i) => (
            <div key={i} className={styles.row}>
              <svg
                className={styles.branch}
                viewBox="0 0 40 38"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M1 0 C1 20 16 34 34 34"
                  markerEnd="url(#loreArrowhead)"
                />
              </svg>
              <article className={styles.card}>
                <span className={styles.kind}>{entry.kind}</span>
                <h3 className={styles.role}>{entry.title}</h3>
                {entry.org && <span className={styles.org}>{entry.org}</span>}
                <span className={styles.period}>{entry.period}</span>
                {entry.note && <p className={styles.note}>{entry.note}</p>}
              </article>
            </div>
          ))}

          <span className={styles.spineDots} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
