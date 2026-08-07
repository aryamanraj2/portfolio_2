import Link from "next/link";
import styles from "./Rail.module.css";

export default function Rail({
  part,
  position,
  total,
}: {
  part: string;
  position: number;
  total: number;
}) {
  return (
    <nav className={styles.rail} aria-label="Breadcrumb">
      <Link href="/" className={styles.back}>
        ← index
      </Link>
      <span className={styles.stamp}>
        <span>{part}</span>
        <span className={styles.count}>
          {position.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
        </span>
      </span>
    </nav>
  );
}
