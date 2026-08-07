import styles from "./Mark.module.css";

const CALLS = [
  "1024 × 1024 source, no rounded mask applied",
  "single tint over ink, no gradient",
  "optically centred, not mathematically",
];

export default function Mark({ wordmark }: { wordmark: string }) {
  return (
    <figure className={styles.mark}>
      <div className={styles.frame}>
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
        <div
          className={`${styles.plate} halftone`}
          role="img"
          aria-label={`${wordmark} app icon, placeholder`}
        />
      </div>

      <figcaption className={styles.body}>
        <p className={styles.dims}>200 × 200 px / 1024 × 1024 source</p>
        <ol className={styles.calls}>
          {CALLS.map((text, i) => (
            <li key={text} className={styles.call}>
              <span className={styles.n}>(({i + 1}))</span>
              <span className={styles.lead} aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
