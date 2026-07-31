"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";
import Emphasis, { type Segment } from "./Emphasis";
import { type TintKey } from "./Wash";

type Project = {
  title: string;
  tint: TintKey;
  lite: string;
  tech: string[];
  note: Segment[];
};

const PROJECTS: Project[] = [
  {
    title: "Wandr",
    tint: "wandr",
    lite: "var(--wandr-lite)",
    tech: [
      "Swift",
      "SwiftUI",
      "Foundation Models",
      "App Intents",
      "Natural Language",
      "Evaluations Framework",
    ],
    note: [
      "Turns a group chat into ",
      { kw: "a decided night out" },
      ". A seven-stage pipeline pulls intent from a Siri summary, researches live venues, and resolves conflicts down a constraint ladder that relaxes budget before it ever touches dietary or accessibility. The model only ranks; deterministic code alone mints the plan, and the chat itself is never stored.",
    ],
  },
  {
    title: "Saldo",
    tint: "saldo",
    lite: "var(--saldo-lite)",
    tech: [
      "Swift",
      "SwiftUI",
      "Vision",
      "Natural Language",
      "Foundation Models",
    ],
    note: [
      "A student budgeting app that ",
      { kw: "reacts to your balance" },
      " — a theming engine maps what is left to a palette and repaints the whole interface as the number moves. Receipts are read straight off the camera, goal images are cut from their background on device, and every insight is computed against a store that never leaves the phone. It won Apple's ",
      { kw: "Swift Student Challenge 2026" },
      ".",
    ],
  },
  {
    title: "AquaSense",
    tint: "aqua",
    lite: "var(--aqua-lite)",
    tech: [
      "Swift",
      "Vision",
      "LangChain",
      "Flask",
      "Gemini API",
      "Random Forest",
      "Kotlin",
    ],
    note: [
      "Aquarium care where ",
      { kw: "the classifier owns the verdict" },
      " and the model only explains it — water readings are scored first, so the language layer can phrase a result but never invent one. Three routable specialists split the work: live telemetry, image diagnosis from a photo of the fish, and a remediation cart assembled from whatever just got flagged. It took ",
      { kw: "Best Overall Project" },
      " and ",
      { kw: "Best Use of Gemini" },
      " at an MLH hackathon, with a runner-up finish for UI/UX.",
    ],
  },
];

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

export default function Projects({
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
    tint.current?.(index === null ? null : PROJECTS[index].tint);
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
          onMouseLeave={() => reach(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) reach(null);
          }}
        >
          {PROJECTS.map((project, index) => (
            <button
              key={project.title}
              type="button"
              className={`${styles.row} ${index === open ? styles.open : ""}`}
              style={{ "--lite": project.lite } as CSSProperties}
              aria-expanded={index === open}
              onMouseEnter={() => reach(index)}
              onFocus={() => reach(index)}
              onClick={() => reach(index)}
            >
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
            </button>
          ))}
          <button
            type="button"
            className={styles.more}
            onMouseEnter={() => reach(null)}
            onFocus={() => reach(null)}
          >
            <span className={styles.moreLabel}>View more</span>
            <span className={styles.moreIcon} aria-hidden="true">
              <ArrowUpRight size={17} strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
