"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Landing.module.css";
import GithubCalendar from "./GithubCalendar";
import Emphasis, { type Segment } from "./Emphasis";
import Lore from "./Lore";
import Projects from "./Projects";
import Stamp from "./Stamp";
import Wash, { type TintKey, type WashHandle } from "./Wash";

const GITHUB_USER = "aryamanraj2";

const SOURCE = ">Works";
const TARGET = "Aryaman Jaiswal";
const TAGLINE = "Undergrad, building for iOS and Android.";
const BIO: Segment[][] = [
  ["I'm Aryaman, an undergrad and a freelancer, building things."],
  [
    "I write ",
    { kw: "native" },
    " apps for iOS and Android, the ",
    { kw: "AI pipelines" },
    " that run inside them, and the ",
    { kw: "backends" },
    " behind them.",
  ],
];
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/\\[]{}=+*^?#";

const BOOT_MS = 300;
const TYPE_MS = 68;
const HOLD_MS = 720;
const MORPH_MS = 1440;
const NAME_MS = 720;

type Cell = { char: string; scrambling: boolean };
type Phase = "terminal" | "morph" | "name" | "inflate";

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

export default function Landing() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [phase, setPhase] = useState<Phase>("terminal");
  const [enter, setEnter] = useState(false);
  const wash = useRef<WashHandle>(null);

  const tint = useCallback((key: TintKey | null) => {
    wash.current?.to(key);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

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
        if (cancelled) return;
        setPhase("inflate");
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
      <Wash ref={wash} />
      <Stamp active={phase === "inflate"} />
      <div className={styles.screen}>
        <div className={styles.hero}>
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
          <div className={styles.supporting}>
            <p className={styles.tagline}>{TAGLINE}</p>
            <div className={styles.bio}>
              {BIO.map((line, i) => (
                <p key={i} className={styles.description}>
                  <Emphasis parts={line} />
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.cta}>
            <a className={styles.action} href="/resume.pdf" download>
              <span className={styles.actionLabel}>résumé</span>
              <span className={styles.arrow}>
                <ArrowUpRight size={17} strokeWidth={1.8} />
              </span>
            </a>
          </div>
          <GithubCalendar username={GITHUB_USER} active={phase === "inflate"} />
        </div>
        <Lore active={phase === "inflate"} />
        <Projects active={phase === "inflate"} onTint={tint} />
      </div>
    </div>
  );
}
