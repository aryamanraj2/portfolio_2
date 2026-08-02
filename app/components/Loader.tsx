"use client";

import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const FIRST = "Hello";
const REST = [
  "नमस्ते",
  "নমস্কার",
  "வணக்கம்",
  "నమస్కారం",
  "ನಮಸ್ಕಾರ",
  "നമസ്കാരം",
  "નમસ્તે",
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "नमस्कार",
  "ନମସ୍କାର",
  "السلام علیکم",
  "নমস্কাৰ",
];
const GREETINGS = [FIRST, ...REST];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DURATION = 2800;
const GREET_INTERVAL = 460;
const SAFETY = 250;

export default function Loader({ onDone }: { onDone?: () => void }) {
  const [pct, setPct] = useState(0);
  const [tick, setTick] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [seq, setSeq] = useState<string[]>(GREETINGS);

  useEffect(() => {
    setSeq([FIRST, ...shuffle(REST)]);
  }, []);

  useEffect(() => {
    let raf = 0;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setPct(100);
      timers.push(setTimeout(() => setLeaving(true), 320));
      timers.push(setTimeout(() => onDone?.(), 320 + 900));
    };

    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round(ease(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(step);
    timers.push(setTimeout(finish, DURATION + SAFETY));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

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
