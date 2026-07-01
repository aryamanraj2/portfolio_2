"use client";

import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

/* Always leads with "Hello", then the Indian scripts follow. */
const FIRST = "Hello"; // English
const REST = [
  "नमस्ते", // Hindi
  "নমস্কার", // Bengali
  "வணக்கம்", // Tamil
  "నమస్కారం", // Telugu
  "ನಮಸ್ಕಾರ", // Kannada
  "നമസ്കാരം", // Malayalam
  "નમસ્તે", // Gujarati
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", // Punjabi
  "नमस्कार", // Marathi
  "ନମସ୍କାର", // Odia
  "السلام علیکم", // Urdu
  "নমস্কাৰ", // Assamese
];
const GREETINGS = [FIRST, ...REST];

/* Fisher–Yates shuffle so the order feels fresh each load. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DURATION = 2800; // ms for 0 -> 100
const GREET_INTERVAL = 460; // ms per greeting

export default function Loader({ onDone }: { onDone?: () => void }) {
  const [pct, setPct] = useState(0);
  const [tick, setTick] = useState(0);
  const [leaving, setLeaving] = useState(false);
  // Start deterministic (SSR-safe), then shuffle on the client after mount.
  const [seq, setSeq] = useState<string[]>(GREETINGS);

  useEffect(() => {
    setSeq([FIRST, ...shuffle(REST)]);
  }, []);

  // Count 0 -> 100 with an ease-out curve.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round(ease(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        // small beat on 100%, then dissolve
        setTimeout(() => setLeaving(true), 320);
        setTimeout(() => onDone?.(), 320 + 900);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  // Shuffle the greeting on a soft cadence until we finish.
  useEffect(() => {
    if (leaving) return;
    const id = setInterval(() => setTick((v) => v + 1), GREET_INTERVAL);
    return () => clearInterval(id);
  }, [leaving]);

  const current = seq[tick % seq.length];
  const previous = tick > 0 ? seq[(tick - 1) % seq.length] : null;

  return (
    <div className={`${styles.root} ${leaving ? styles.leaving : ""}`}>
      <div className={styles.stage} aria-hidden="true">
        {previous !== null && (
          <span key={tick - 1} className={`${styles.greet} ${styles.out}`}>
            {previous}
          </span>
        )}
        <span key={tick} className={`${styles.greet} ${styles.in}`}>
          {current}
        </span>
      </div>

      <div className={styles.counter}>
        <span className={styles.num}>{pct}</span>
        <span className={styles.pct}>%</span>
      </div>
    </div>
  );
}
