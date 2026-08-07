"use client";

import { useState } from "react";
import type { Release } from "@/app/lib/apps";
import styles from "./Log.module.css";

const FOLD = 2;

export default function Log({ log }: { log: Release[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? log : log.slice(0, FOLD);

  return (
    <div className={styles.log}>
      <ol className={styles.releases}>
        {shown.map((release) => (
          <li key={release.version} className={styles.release}>
            <div className={styles.stamp}>
              <span>{release.version}</span>
              <time className={styles.date} dateTime={release.date}>
                {release.date}
              </time>
            </div>
            <ul className={styles.entries}>
              {release.entries.map((entry) => (
                <li key={entry.text} className={styles.entry}>
                  <span className={styles.mark} aria-hidden="true">
                    {entry.mark}
                  </span>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {log.length > FOLD && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setAll((open) => !open)}
          aria-expanded={all}
        >
          {all ? "[ collapse ]" : `[ show all ${log.length} versions ]`}
        </button>
      )}
    </div>
  );
}
