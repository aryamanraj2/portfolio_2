"use client";

import { useEffect, useState } from "react";
import styles from "./GithubCalendar.module.css";

type Level =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type Day = {
  date: string;
  contributionCount: number;
  contributionLevel: Level;
};

type Data = {
  contributions: Day[][];
  totalContributions: number;
};

const LEVEL_CLASS: Record<Level, string> = {
  NONE: styles.l0,
  FIRST_QUARTILE: styles.l1,
  SECOND_QUARTILE: styles.l2,
  THIRD_QUARTILE: styles.l3,
  FOURTH_QUARTILE: styles.l4,
};

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function GithubCalendar({
  username,
  active = true,
}: {
  username: string;
  active?: boolean;
}) {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.deno.dev/${username}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((json: Data) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (failed || !data) return null;

  return (
    <figure className={`${styles.root} ${active ? styles.active : ""}`}>
      <figcaption className={styles.caption}>
        {data.totalContributions.toLocaleString()} contributions · last year
      </figcaption>
      <div className={styles.grid} aria-hidden="true">
        {data.contributions.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day) => (
              <span
                key={day.date}
                className={`${styles.cell} ${LEVEL_CLASS[day.contributionLevel]}`}
                title={`${day.contributionCount} on ${fmt(day.date)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </figure>
  );
}
