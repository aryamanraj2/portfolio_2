import { Fragment } from "react";
import type { Plate } from "@/app/lib/apps";
import styles from "./Plates.module.css";

export default function Plates({ plates }: { plates: Plate[] }) {
  return (
    <ol className={styles.grid}>
      {plates.map((plate) => (
        <li key={plate.n}>
          <figure className={styles.plate}>
            <div className={styles.stage}>
              <span className={styles.n}>{plate.n}</span>
              <div
                className={`${styles.shell} halftone`}
                role="img"
                aria-label={`${plate.caption}, screenshot placeholder`}
              />
            </div>
            <figcaption className={styles.caption}>{plate.caption}</figcaption>
            <p className={styles.calls}>
              {plate.calls.map((call, i) => (
                <Fragment key={call}>
                  <span className={styles.marker}>(({i + 1}))</span> {call}.{" "}
                </Fragment>
              ))}
            </p>
          </figure>
        </li>
      ))}
    </ol>
  );
}
