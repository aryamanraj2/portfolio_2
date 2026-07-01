"use client";

import { useEffect, useState } from "react";
import styles from "./Landing.module.css";

const SOURCE = ">Works";
const TARGET = "Aryaman Jaiswal";
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/\\[]{}=+*^?#";

const BOOT_MS = 300;
const TYPE_MS = 68;
const HOLD_MS = 720;
const MORPH_MS = 1180;
const NAME_MS = 620;

type Cell = { char: string; scrambling: boolean };
type Phase = "terminal" | "morph" | "name" | "inflate";

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

export default function Landing() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [phase, setPhase] = useState<Phase>("terminal");
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const morph = () =>
      new Promise<void>((resolve) => {
        const length = Math.max(SOURCE.length, TARGET.length);
        const specs = Array.from({ length }, (_, i) => {
          const start = Math.min(0.52, (i / length) * 0.5) + Math.random() * 0.12;
          return {
            from: SOURCE[i] ?? "",
            to: TARGET[i] ?? "",
            start,
            end: Math.min(1, start + 0.26 + Math.random() * 0.22),
            glyph: "",
          };
        });

        const t0 = performance.now();
        const tick = (now: number) => {
          if (cancelled) return;
          const p = ease(Math.min((now - t0) / MORPH_MS, 1));
          const next = specs
            .map((s) => {
              if (p >= s.end) return { char: s.to, scrambling: false };
              if (p < s.start) return { char: s.from, scrambling: false };
              if (s.to === " ") return { char: " ", scrambling: false };
              if (s.glyph === "" || Math.random() < 0.4) {
                s.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              }
              return { char: s.glyph, scrambling: true };
            })
            .filter((c) => c.char !== "");
          setCells(next);
          if (now - t0 < MORPH_MS) {
            raf = requestAnimationFrame(tick);
          } else {
            setCells(settled(TARGET));
            resolve();
          }
        };
        raf = requestAnimationFrame(tick);
      });

    const run = async () => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setEnter(true);

      if (reduce) {
        setCells(settled(TARGET));
        setPhase("name");
        await sleep(300);
        if (!cancelled) setPhase("inflate");
        return;
      }

      await sleep(BOOT_MS);
      for (let i = 1; i <= SOURCE.length; i++) {
        if (cancelled) return;
        setCells(settled(SOURCE.slice(0, i)));
        await sleep(TYPE_MS);
      }

      await sleep(HOLD_MS);
      if (cancelled) return;
      setPhase("morph");
      await morph();
      if (cancelled) return;

      setPhase("name");
      await sleep(NAME_MS);
      if (cancelled) return;
      setPhase("inflate");
    };

    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={`${styles.root} ${styles[phase]} ${enter ? styles.enter : ""}`}
    >
      <h1 className={styles.line} aria-label={TARGET}>
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
        <span className={styles.cursor} aria-hidden="true" />
      </h1>
    </div>
  );
}
