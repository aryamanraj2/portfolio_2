import { ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";

type Project = {
  title: string;
  field: string;
  status: string;
  note: string;
  stack: string[];
  href?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Infra Copilot",
    field: "Cloud ops",
    status: "Internal",
    note: "A monitoring layer for cloud infrastructure with faster dashboards and a guarded assistant for asking database questions in plain English.",
    stack: ["Backend", "Dashboards", "LLM"],
  },
  {
    title: "Exam Cell OS",
    field: "Operations",
    status: "Shipped",
    note: "A scheduling and staff-duty platform that automated exam planning for 10,000+ students and moved attendance workflows onto mobile.",
    stack: ["Mobile", "Scheduling", "Admin"],
  },
  {
    title: "Native AI Apps",
    field: "Mobile",
    status: "Ongoing",
    note: "iOS and Android builds that pair native interfaces with AI pipelines, backend services, and production-minded interaction design.",
    stack: ["iOS", "Android", "AI"],
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
          <p className={styles.kicker}>Selected builds</p>
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
                <span className={styles.details}>
                  <span className={styles.meta}>
                    {project.field}
                    <span className={styles.dot} />
                    {project.status}
                  </span>
                  <span className={styles.stack}>
                    {project.stack.map((item) => (
                      <span key={item} className={styles.tag}>
                        {item}
                      </span>
                    ))}
                  </span>
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
