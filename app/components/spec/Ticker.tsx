import type { CSSProperties } from "react";
import styles from "./Ticker.module.css";

const COPIES = [0, 1, 2, 3];
const PER_ITEM = 11;
const RUN = 3;

export default function Ticker({ claim }: { claim: string }) {
  const seconds = COPIES.length * RUN * PER_ITEM;

  return (
    <div
      className={styles.ticker}
      style={{ "--dur": `${seconds}s` } as CSSProperties}
    >
      <div className={styles.track} aria-hidden="true">
        {COPIES.map((copy) => (
          <div key={copy} className={styles.seq}>
            {Array.from({ length: RUN }, (_, i) => (
              <span key={i} className={styles.item}>
                {claim}
                <span className={styles.star}>✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="srOnly">{claim}</p>
    </div>
  );
}
