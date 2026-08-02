"use client";

import { memo, useEffect, useState } from "react";
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

type ApiDay = {
  date: string;
  intensity: string;
  count: number;
};

type ApiData = {
  contributions: ApiDay[][];
  total: number;
};

const LEVEL_CLASS: Record<Level, string> = {
  NONE: styles.l0,
  FIRST_QUARTILE: styles.l1,
  SECOND_QUARTILE: styles.l2,
  THIRD_QUARTILE: styles.l3,
  FOURTH_QUARTILE: styles.l4,
};

const level = (intensity: string): Level => {
  const levels: Level[] = [
    "NONE",
    "FIRST_QUARTILE",
    "SECOND_QUARTILE",
    "THIRD_QUARTILE",
    "FOURTH_QUARTILE",
  ];
  return levels[Number(intensity)] ?? "NONE";
};

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SPANS = [
  { query: "(max-width: 560px)", weeks: 20 },
  { query: "(max-width: 720px)", weeks: 30 },
];

function GithubCalendar({
  username,
  active = true,
}: {
  username: string;
  active?: boolean;
}) {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [weeks, setWeeks] = useState(0);

  useEffect(() => {
    const lists = SPANS.map((span) => window.matchMedia(span.query));
    const sync = () => {
      const hit = SPANS.findIndex((_, i) => lists[i].matches);
      setWeeks(hit === -1 ? 0 : SPANS[hit].weeks);
    };
    sync();
    lists.forEach((list) => list.addEventListener("change", sync));
    return () =>
      lists.forEach((list) => list.removeEventListener("change", sync));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://gh-calendar.rschristian.dev/user/${username}`)
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((json: ApiData) => {
        if (cancelled) return;
        setData({
          totalContributions: json.total,
          contributions: json.contributions.map((week) =>
            week.map((day) => ({
              date: day.date,
              contributionCount: day.count,
              contributionLevel: level(day.intensity),
            })),
          ),
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (failed || !data) return null;

  const shown = weeks
    ? data.contributions.slice(-weeks)
    : data.contributions;

  return (
    <figure className={`${styles.root} ${active ? styles.active : ""}`}>
      <figcaption className={styles.caption}>
        {data.totalContributions.toLocaleString()} contributions · last year
      </figcaption>
      <div className={styles.grid} aria-hidden="true">
        {shown.map((week, wi) => (
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

export default memo(GithubCalendar);
