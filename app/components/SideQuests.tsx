"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import styles from "./SideQuests.module.css";

type Quest = {
  id: string;
  tab: string;
  title: string;
  kicker: string;
  status: string;
};

const QUESTS: Quest[] = [
  {
    id: "pr",
    tab: "PR",
    title: "Side Quests",
    kicker: "Personal records",
    status: "coming soon",
  },
  {
    id: "music",
    tab: "Music",
    title: "On Repeat",
    kicker: "Currently looping",
    status: "coming soon",
  },
];

const LIFTS = ["Bench", "Squat", "Deadlift", "Shoulder Press", "Rows"];

const BARS = [0.52, 0.9, 0.34, 1, 0.62, 0.42, 0.94, 0.26, 0.74, 0.48, 0.86, 0.36,
  0.66, 0.8, 0.44, 0.96];

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/\\[]{}=+*^?#";

const MORPH_MS = 1080;

type Cell = { char: string; scrambling: boolean };

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function SideQuests({ active = true }: { active?: boolean }) {
  const [index, setIndex] = useState(0);
  const [cells, setCells] = useState<Cell[]>(() => settled(QUESTS[0].title));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = useRef(QUESTS[0].title);
  const first = useRef(true);
  const raf = useRef(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const target = QUESTS[index].title;
    const source = shown.current;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = target;
      setCells(settled(target));
      return;
    }

    const length = Math.max(source.length, target.length);
    const specs = Array.from({ length }, (_, i) => {
      const start = Math.min(0.5, (i / length) * 0.46) + Math.random() * 0.14;
      return {
        from: source[i] ?? "",
        to: target[i] ?? "",
        start,
        end: Math.min(1, start + 0.24 + Math.random() * 0.2),
        glyph: "",
      };
    });

    const t0 = performance.now();

    const tick = (now: number) => {
      const p = ease(Math.min((now - t0) / MORPH_MS, 1));
      const next = specs
        .map((spec) => {
          if (p >= spec.end) return { char: spec.to, scrambling: false };
          if (p < spec.start) return { char: spec.from, scrambling: false };
          if (spec.to === " ") return { char: " ", scrambling: false };
          if (spec.glyph === "" || Math.random() < 0.4) {
            spec.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          return { char: spec.glyph, scrambling: true };
        })
        .filter((cell) => cell.char !== "");

      shown.current = next.map((cell) => cell.char).join("");
      setCells(next);

      if (now - t0 < MORPH_MS) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      shown.current = target;
      setCells(settled(target));
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [index]);

  const steer = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + QUESTS.length) % QUESTS.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      className={`${styles.quests} ${active ? styles.active : ""}`}
      aria-label="Side quests"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title} aria-label={QUESTS[index].title}>
            <span className={styles.text} aria-hidden="true">
              {cells.map((cell, i) => (
                <span
                  key={i}
                  className={cell.scrambling ? styles.scramble : styles.glyph}
                >
                  {cell.char}
                </span>
              ))}
            </span>
          </h2>
          <div
            className={styles.tabs}
            role="tablist"
            aria-orientation="vertical"
            aria-label="Side quest channels"
            onKeyDown={steer}
          >
            {QUESTS.map((item, i) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`quest-tab-${item.id}`}
                aria-controls={`quest-panel-${item.id}`}
                aria-selected={i === index}
                tabIndex={i === index ? 0 : -1}
                className={`${styles.tab} ${i === index ? styles.on : ""}`}
                onClick={() => setIndex(i)}
              >
                <span className={styles.mark} aria-hidden="true">
                  <span className={styles.pip} />
                </span>
                <span className={styles.label}>{item.tab}</span>
              </button>
            ))}
          </div>
        </header>

        <div className={styles.stage}>
          {QUESTS.map((item, i) => (
            <div
              key={item.id}
              role="tabpanel"
              id={`quest-panel-${item.id}`}
              aria-labelledby={`quest-tab-${item.id}`}
              inert={i !== index}
              className={`${styles.panel} ${i === index ? styles.on : ""}`}
            >
              <span className={styles.kicker}>{item.kicker}</span>

              {item.id === "pr" ? (
                <ol className={styles.lifts}>
                  {LIFTS.map((lift, k) => (
                    <li
                      key={lift}
                      className={styles.lift}
                      style={{ "--i": k } as CSSProperties}
                    >
                      <span className={styles.rank}>
                        {(k + 1).toString().padStart(2, "0")}
                      </span>
                      <span className={styles.liftName}>{lift}</span>
                      <span className={styles.leader} aria-hidden="true" />
                      <span className={styles.blank} aria-hidden="true">
                        ———
                      </span>
                      <span className={styles.unit}>kg</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.music}>
                  <span className={styles.eq} aria-hidden="true">
                    {BARS.map((peak, k) => (
                      <span
                        key={k}
                        className={styles.bar}
                        style={
                          {
                            "--p": peak,
                            "--d": `${(k % 7) * -0.19 - 0.05}s`,
                            "--s": `${0.82 + (k % 4) * 0.15}s`,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </span>
                  <p className={styles.line}>
                    The rotation that runs behind every build — records, films,
                    and whatever book is open.
                  </p>
                </div>
              )}

              <span className={styles.status}>
                <span className={styles.caret} aria-hidden="true" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
