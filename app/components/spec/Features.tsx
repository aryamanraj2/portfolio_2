import type { Feature } from "@/app/lib/apps";
import styles from "./Features.module.css";

export default function Features({ features }: { features: Feature[] }) {
  return (
    <ol className={styles.list}>
      {features.map((feature, i) => (
        <li key={feature.title} className={styles.item}>
          <span className={styles.n}>
            {(i + 1).toString().padStart(2, "0")}
          </span>
          <h3 className={styles.title}>{feature.title}</h3>
          <p className={styles.body}>{feature.body}</p>
        </li>
      ))}
    </ol>
  );
}
