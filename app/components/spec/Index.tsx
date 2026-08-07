import Link from "next/link";
import { APPS } from "@/app/lib/apps";
import styles from "./Index.module.css";

export default function Index({ current }: { current: string }) {
  return (
    <ul className={styles.list}>
      {APPS.map((app, i) => {
        const n = (i + 1).toString().padStart(2, "0");
        const here = app.slug === current;

        const inner = (
          <>
            <span className={styles.n}>{n}</span>
            <span className={styles.part}>{app.part}</span>
            <span className={styles.name}>{app.wordmark}</span>
            <span className={styles.claim}>{app.claim}</span>
            <span className={styles.arrow} aria-hidden="true">
              {here ? "●" : "→"}
            </span>
          </>
        );

        return (
          <li key={app.slug}>
            {here ? (
              <div className={`${styles.row} ${styles.here}`} aria-current="page">
                {inner}
              </div>
            ) : (
              <Link href={`/apps/${app.slug}`} className={styles.row}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
