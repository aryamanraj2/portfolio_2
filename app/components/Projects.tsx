import { ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";

type Project = {
  title: string;
  note: string;
  href?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Infra Copilot",
    note: "A monitoring layer for cloud infrastructure with faster dashboards and a guarded assistant for asking database questions in plain English.",
  },
  {
    title: "Exam Cell OS",
    note: "A scheduling and staff-duty platform that automated exam planning for 10,000+ students and moved attendance workflows onto mobile.",
  },
  {
    title: "Native AI Apps",
    note: "iOS and Android builds that pair native interfaces with AI pipelines, backend services, and production-minded interaction design.",
  },
];

export default function Projects({ active = true }: { active?: boolean }) {
  return (
    <section
      className={`${styles.projects} ${active ? styles.active : ""}`}
      aria-label="Projects"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Projects</h2>
        </header>
        <div className={styles.board}>
          {PROJECTS.map((project, index) => {
            const content = (
              <>
                <span className={styles.index}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className={styles.main}>
                  <span className={styles.name}>{project.title}</span>
                  <span className={styles.note}>{project.note}</span>
                </span>
                <span className={styles.open} aria-hidden="true">
                  <ArrowUpRight size={18} strokeWidth={1.8} />
                </span>
              </>
            );

            return project.href ? (
              <a
                key={project.title}
                className={styles.project}
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            ) : (
              <article key={project.title} className={styles.project}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
