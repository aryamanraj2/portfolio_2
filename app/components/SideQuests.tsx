"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
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
    title: "1000 lbs",
    kicker: "Powerlifting total",
    status: "430 kg total",
  },
  {
    id: "music",
    tab: "Music",
    title: "On Repeat",
    kicker: "Currently looping",
    status: "coming soon",
  },
];

const GOAL = 1000;

const LIFTS = [
  { name: "Deadlift", lbs: 407, kg: 185 },
  { name: "Squat", lbs: 308, kg: 140 },
  { name: "Bench", lbs: 231, kg: 105 },
];

const TOTAL = LIFTS.reduce((sum, lift) => sum + lift.lbs, 0);
const GAP = GOAL - TOTAL;
const FILL = (TOTAL / GOAL) * 100;

const STACK = LIFTS.map((lift, i) => {
  const below = LIFTS.slice(0, i).reduce((sum, l) => sum + l.lbs, 0);
  return {
    ...lift,
    span: (lift.lbs / GOAL) * 100,
    mid: ((below + lift.lbs / 2) / GOAL) * 100,
  };
});

const BARS = [0.52, 0.9, 0.34, 1, 0.62, 0.42, 0.94, 0.26, 0.74, 0.48, 0.86, 0.36,
  0.66, 0.8, 0.44, 0.96];

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/\\[]{}=+*^?#";

const MORPH_MS = 1080;
const SLAM = "M0,0 C0.12,0.82 0.18,1 1,1";

type Cell = { char: string; scrambling: boolean };

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function SideQuests({ active = true }: { active?: boolean }) {
  const [index, setIndex] = useState(0);
  const [cells, setCells] = useState<Cell[]>(() => settled(QUESTS[0].title));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const rig = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const node = rig.current;
    if (!node || !active || index !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(CustomEase, ScrambleTextPlugin);
    const slam = CustomEase.create("questSlam", SLAM);

    let io: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: slam } });

      tl.from(
        "[data-frame]",
        { scaleY: 0, duration: 0.5, transformOrigin: "bottom" },
        0,
      )
        .from(
          "[data-band]",
          { height: 0, duration: 0.42, stagger: 0.14, clearProps: "height" },
          0.15,
        )
        .to(
          "[data-count]",
          {
            duration: 1.1,
            ease: "none",
            scrambleText: {
              text: String(TOTAL),
              chars: "0123456789",
              speed: 0.7,
              revealDelay: 0.25,
            },
          },
          0.15,
        )
        .from(
          "[data-line]",
          { scaleX: 0, duration: 0.34, stagger: 0.08 },
          0.62,
        )
        .from(
          "[data-ch]",
          { opacity: 0, yPercent: 40, duration: 0.3, stagger: 0.012 },
          0.7,
        )
        .from(
          "[data-val]",
          { opacity: 0, x: -8, duration: 0.34, stagger: 0.08 },
          0.78,
        )
        .from("[data-crest]", { scaleX: 0, duration: 0.45 }, 0.88)
        .from("[data-goal]", { scaleX: 0, duration: 0.5 }, 0.95)
        .from("[data-cap]", { opacity: 0, duration: 0.3 }, 1.05)
        .from("[data-out]", { opacity: 0, x: -8, duration: 0.34 }, 1.15)
        .from("[data-void]", { opacity: 0, duration: 0.44 }, 1.25);

      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io?.disconnect();
          tl.play();
        },
        { rootMargin: "-12% 0px -12% 0px" },
      );

      io.observe(node);
    }, rig);

    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, [active, index]);

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
                <div
                  className={styles.rig}
                  ref={rig}
                  style={{ "--fill": `${FILL}%` } as CSSProperties}
                >
                  <div className={styles.readout}>
                    <span className={styles.tally}>
                      <span className={styles.count} data-count>
                        {TOTAL}
                      </span>
                      <span className={styles.of}>of {GOAL} lbs</span>
                    </span>
                    <span className={styles.out} data-out>
                      {GAP} lbs out
                    </span>
                  </div>

                  <div className={styles.elevation}>
                    <div className={styles.column}>
                      <span
                        className={styles.frame}
                        data-frame
                        aria-hidden="true"
                      />
                      <span className={styles.void} data-void aria-hidden="true" />
                      <div className={styles.stack} aria-hidden="true">
                        {STACK.map((band) => (
                          <span
                            key={band.name}
                            className={styles.band}
                            data-band
                            style={{ "--b": band.span } as CSSProperties}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={styles.annotations}>
                      <span
                        className={styles.goal}
                        style={{ "--y": "100%" } as CSSProperties}
                      >
                        <span
                          className={styles.goalRule}
                          data-goal
                          aria-hidden="true"
                        />
                        <span className={styles.goalCap} data-cap>
                          {GOAL}
                        </span>
                      </span>

                      <span
                        className={styles.crest}
                        style={{ "--y": "var(--fill)" } as CSSProperties}
                        aria-hidden="true"
                      >
                        <span className={styles.crestRule} data-crest />
                        <span className={`${styles.goalCap} ${styles.ghostCap}`}>
                          {GOAL}
                        </span>
                      </span>

                      {STACK.map((band) => (
                        <span
                          key={band.name}
                          className={styles.note}
                          style={{ "--y": `${band.mid}%` } as CSSProperties}
                        >
                          <span
                            className={styles.noteLine}
                            data-line
                            aria-hidden="true"
                          />
                          <span className={styles.noteName}>
                            {[...band.name].map((char, j) => (
                              <span key={j} className={styles.ch} data-ch>
                                {char}
                              </span>
                            ))}
                          </span>
                          <span className={styles.noteVal} data-val>
                            <span className={styles.noteLbs}>{band.lbs}</span>
                            <span className={styles.noteKg}>{band.kg} kg</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
