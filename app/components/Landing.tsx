"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Landing.module.css";
import GithubCalendar from "./GithubCalendar";
import Emphasis, { type Segment } from "./Emphasis";
import Lore from "./Lore";
import Projects from "./Projects";
import SideQuests from "./SideQuests";
import Footer from "./Footer";
import Stamp from "./Stamp";
import Wash, { type TintKey, type WashHandle } from "./Wash";
import type { Rotation } from "@/app/lib/music";

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
const CHURN_MS = 45;
const SAFETY = 250;

const SPAN = Math.max(SOURCE.length, TARGET.length);

type Cell = { char: string; scrambling: boolean };
type Phase = "terminal" | "morph" | "name" | "inflate";

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

export default function Landing({
  rotation,
  start = true,
}: {
  rotation: Rotation;
  start?: boolean;
}) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [phase, setPhase] = useState<Phase>("terminal");
  const [enter, setEnter] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wash = useRef<WashHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const glyphs = useRef<(HTMLSpanElement | null)[]>([]);

  const tint = useCallback((key: TintKey | null) => {
    wash.current?.to(key);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const onScroll = () => {
      setScrolled(true);
      node.removeEventListener("scroll", onScroll);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!start) return;

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
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          cancelAnimationFrame(raf);
          resolve();
        };

        const specs = Array.from({ length: SPAN }, (_, i) => {
          const start = Math.min(0.52, (i / SPAN) * 0.5) + Math.random() * 0.12;
          return {
            from: SOURCE[i] ?? "",
            to: TARGET[i] ?? "",
            start,
            end: Math.min(1, start + 0.26 + Math.random() * 0.22),
            glyph: "",
          };
        });

        const churn = window.matchMedia("(hover: none)").matches ? CHURN_MS : 0;

        let t0 = 0;
        let drawn = 0;
        const tick = (now: number) => {
          if (cancelled) return;
          const nodes = glyphs.current;
          if (!nodes[0]) {
            raf = requestAnimationFrame(tick);
            return;
          }
          if (!t0) t0 = now;

          const done = now - t0 >= MORPH_MS;
          if (!done && now - drawn < churn) {
            raf = requestAnimationFrame(tick);
            return;
          }
          drawn = now;

          const p = ease(Math.min((now - t0) / MORPH_MS, 1));
          for (let i = 0; i < SPAN; i++) {
            const node = nodes[i];
            if (!node) continue;
            const s = specs[i];
            let char = s.from;
            let hazy = false;
            if (p >= s.end) char = s.to;
            else if (p >= s.start) {
              if (s.to === " ") char = " ";
              else {
                if (s.glyph === "" || Math.random() < 0.4) {
                  s.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
                char = s.glyph;
                hazy = true;
              }
            }
            if (node.firstChild) {
              if (node.firstChild.nodeValue !== char) {
                node.firstChild.nodeValue = char;
              }
            } else if (char) {
              node.appendChild(document.createTextNode(char));
            }
            const cls = hazy ? styles.scramble : styles.glyph;
            if (node.className !== cls) node.className = cls;
          }

          if (now - t0 < MORPH_MS) {
            raf = requestAnimationFrame(tick);
          } else {
            settle();
          }
        };
        raf = requestAnimationFrame(tick);
        timers.push(setTimeout(settle, MORPH_MS + SAFETY));
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

      setCells(settled(TARGET));
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
  }, [start]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${styles[phase]} ${enter ? styles.enter : ""}`}
    >
      <Wash ref={wash} />
      <div className={styles.screen}>
        <div className={styles.hero}>
          <h1 className={styles.line} aria-label={TARGET}>
            <span className={styles.srOnly}>{TARGET}</span>
            <span
              key={phase === "morph" ? "morph" : "cells"}
              className={styles.text}
              aria-hidden="true"
            >
              {phase === "morph"
                ? Array.from({ length: SPAN }, (_, i) => (
                    <span
                      key={i}
                      ref={(node) => {
                        glyphs.current[i] = node;
                      }}
                      className={styles.glyph}
                    />
                  ))
                : cells.map((cell, i) => (
                    <span
                      key={i}
                      className={
                        cell.scrambling ? styles.scramble : styles.glyph
                      }
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
                  <Emphasis parts={line} play={scrolled} />
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.cta}>
            <a
              className={styles.action}
              href="/resume"
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.actionLabel}>résumé</span>
              <span className={styles.arrow}>
                <ArrowUpRight size={17} strokeWidth={1.8} />
              </span>
            </a>
          </div>
          {start && <Stamp active={phase === "inflate"} />}
          <GithubCalendar username={GITHUB_USER} active={phase === "inflate"} />
        </div>
        <Lore active={phase === "inflate"} />
        <Projects active={phase === "inflate"} onTint={tint} />
        <SideQuests active={phase === "inflate"} rotation={rotation} />
        <Footer active={phase === "inflate"} />
      </div>
    </div>
  );
}
