"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import styles from "./Projects.module.css";
import Emphasis from "./Emphasis";
import { type TintKey } from "./Wash";
import { APPS } from "@/app/lib/apps";

const TAP = "(pointer: coarse)";

const tapping = () => window.matchMedia(TAP).matches;

const MARQUEE_COPIES = [0, 1, 2, 3];
const SECONDS_PER_ITEM = 5.3;

const SPIN_MS = 4000;
const SPIN_WHIP = 280;
const SPIN_SETTLE = 700;
const SPIN_SPLIT = 0.62;
const SPIN_BOOST = 78;
const SPIN_BLUR = 2.6;

const TechStrip = ({ tech, open }: { tech: string[]; open: boolean }) => {
  const items = tech.length;
  const seconds = items * SECONDS_PER_ITEM;
  const trackRef = useRef<HTMLSpanElement>(null);
  const spent = useRef(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!open || spent.current) return;
    spent.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (tapping()) return;
    setSpinning(true);
  }, [open]);

  useEffect(() => {
    if (!spinning) return;
    const track = trackRef.current;
    if (!track) return;

    const copy = track.offsetWidth / MARQUEE_COPIES.length;
    if (!copy) {
      setSpinning(false);
      return;
    }

    const cruise = copy / (seconds * 1000);
    const surge = cruise * (SPIN_BOOST - 1);
    const glide = (t: number) =>
      cruise * t +
      surge *
        (SPIN_SPLIT * SPIN_WHIP * (1 - Math.exp(-t / SPIN_WHIP)) +
          (1 - SPIN_SPLIT) * SPIN_SETTLE * (1 - Math.exp(-t / SPIN_SETTLE)));
    const excess = (t: number) =>
      SPIN_SPLIT * Math.exp(-t / SPIN_WHIP) +
      (1 - SPIN_SPLIT) * Math.exp(-t / SPIN_SETTLE);

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = Math.min(now - start, SPIN_MS);
      const ridden = glide(t);
      track.style.transform = `translate3d(${-ridden}px, 0, 0)`;

      if (t >= SPIN_MS) {
        track.style.filter = "";
        track.style.animationDelay = `${(
          -((ridden % copy) / copy) * seconds
        ).toFixed(3)}s`;
        setSpinning(false);
        return;
      }

      track.style.filter = `blur(${(SPIN_BLUR * excess(t) ** 0.5).toFixed(2)}px)`;
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [spinning, seconds]);

  return (
    <span className={`${styles.stack} ${spinning ? styles.spinning : ""}`}>
      <span
        ref={trackRef}
        className={styles.track}
        style={{ "--dur": `${seconds.toFixed(1)}s` } as CSSProperties}
        aria-hidden="true"
      >
        {MARQUEE_COPIES.map((copy) => (
          <span key={copy} className={styles.seq}>
            {tech.map((item) => (
              <span key={item} className={styles.chip}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </span>
        ))}
      </span>
      <span className={styles.srOnly}>{tech.join(", ")}</span>
    </span>
  );
};

function Projects({
  active = true,
  onTint,
}: {
  active?: boolean;
  onTint?: (key: TintKey | null) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const tint = useRef(onTint);
  tint.current = onTint;

  const reach = useCallback((index: number | null) => {
    setOpen(index);
    if (tapping()) return;
    tint.current?.(index === null ? null : APPS[index].tint);
  }, []);

  useEffect(() => {
    if (active) return;
    tint.current?.(null);
  }, [active]);

  useEffect(() => () => tint.current?.(null), []);

  return (
    <section
      className={`${styles.projects} ${active ? styles.active : ""}`}
      aria-label="Projects"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Projects</h2>
        </header>
        <div
          className={`${styles.board} ${open !== null ? styles.focused : ""}`}
          onMouseLeave={() => {
            if (!tapping()) reach(null);
          }}
          onBlur={(event) => {
            if (tapping()) return;
            if (!event.currentTarget.contains(event.relatedTarget)) reach(null);
          }}
        >
          {APPS.map((project, index) => (
            <Link
              key={project.title}
              href={`/apps/${project.slug}`}
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.row} ${index === open ? styles.open : ""}`}
              style={{ "--lite": project.lite } as CSSProperties}
              aria-expanded={index === open}
              onMouseEnter={() => {
                if (!tapping()) reach(index);
              }}
              onFocus={() => {
                if (!tapping()) reach(index);
              }}
              onClick={() => reach(index)}
            >
              <span className={styles.cue} aria-hidden="true">
                Spec ↗
              </span>
              <span className={styles.index}>
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className={styles.body}>
                <span className={styles.head}>
                  <span className={styles.name}>{project.title}</span>
                </span>
                <span className={styles.reveal}>
                  <span className={styles.revealInner}>
                    <span className={styles.detail}>
                      <span className={styles.note}>
                        <Emphasis
                          parts={project.note}
                          play={index === open}
                        />
                      </span>
                      <TechStrip tech={project.tech} open={index === open} />
                    </span>
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Projects);
