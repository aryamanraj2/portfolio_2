import { PRIVACY_COLS, type Privacy } from "@/app/lib/apps";
import styles from "./Matrix.module.css";

export default function Matrix({
  privacy,
  line,
}: {
  privacy: Privacy[];
  line: string;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col">
                <span className="srOnly">Data type</span>
              </th>
              {PRIVACY_COLS.map((col) => (
                <th key={col} className={styles.col} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {privacy.map((entry) => (
              <tr key={entry.row}>
                <th className={styles.row} scope="row">
                  {entry.row}
                </th>
                {entry.cells.map((on, i) => (
                  <td key={PRIVACY_COLS[i]} className={styles.cell}>
                    <span
                      className={`${styles.box} ${on ? styles.on : ""}`}
                      aria-hidden="true"
                    />
                    <span className="srOnly">{on ? "yes" : "no"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.line}>{line}</p>
    </div>
  );
}
