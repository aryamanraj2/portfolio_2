import type { App } from "@/app/lib/apps";
import styles from "./Sheet.module.css";

export default function Sheet({
  highlights,
  specs,
  derived,
}: Pick<App, "highlights" | "specs" | "derived">) {
  return (
    <div className={styles.sheet}>
      <ul className={styles.highlights}>
        {highlights.map((line) => (
          <li key={line} className={styles.highlight}>
            {line}
          </li>
        ))}
      </ul>

      <div className={styles.groups}>
        {specs.map((spec) => (
          <table key={spec.group} className={styles.table}>
            <caption className={styles.group}>{spec.group}</caption>
            <tbody>
              {spec.rows.map(([key, value]) => (
                <tr key={key}>
                  <th className={styles.key} scope="row">
                    {key}
                  </th>
                  <td className={styles.value}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>

      <p className={styles.derived}>
        <span className={styles.figure}>{derived.value}</span>
        <span className={styles.gloss}>{derived.gloss}</span>
      </p>
    </div>
  );
}
