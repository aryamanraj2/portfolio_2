"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import styles from "./SideQuests.module.css";
import type { Rotation } from "@/app/lib/music";

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
    kicker: "Last 30 days",
    status: "",
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

const STEPS = 22;
const BUS_STEPS = 28;

const TOP_LIFT = LIFTS.reduce((top, lift) => (lift.lbs > top ? lift.lbs : top), 0);

const CHANNELS = LIFTS.map((lift, i) => ({
  ...lift,
  id: `Ch${i + 1}`,
  on: Math.max(1, Math.round((lift.lbs / TOP_LIFT) * STEPS)),
}));

const BUS_ON = Math.round((TOTAL / GOAL) * BUS_STEPS);

const lit = (on: number, steps: number): string => `${(on / steps) * 100}%`;

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep",
  "oct", "nov", "dec"];

const when = (iso: string): string => {
  if (!iso) return "sample rotation";
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return "sample rotation";
  return `updated ${at.getUTCDate()} ${MONTHS[at.getUTCMonth()]}`;
};

const stamp = (rotation: Rotation): string => {
  const mark = when(rotation.updated);
  if (rotation.minutes <= 0) return mark;
  return `${rotation.minutes.toLocaleString("en-US")} min listened · ${mark}`;
};

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/\\[]{}=+*^?#";

const MORPH_MS = 1080;
const SLAM = "M0,0 C0.12,0.82 0.18,1 1,1";

type Cell = { char: string; scrambling: boolean };

const settled = (text: string): Cell[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const pad = (value: number): string => String(value).padStart(2, "0");

function Cell({
  link,
  shape,
  children,
}: {
  link: string | null;
  shape: string;
  children: ReactNode;
}) {
  if (!link) return <div className={shape}>{children}</div>;

  return (
    <a
      className={`${shape} ${styles.linked}`}
      href={link}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  );
}

function Sleeve({ art, big = false }: { art: string | null; big?: boolean }) {
  return (
    <span className={`${styles.sleeve} ${big ? styles.plate12 : ""}`}>
      {art ? (
        <img
          className={styles.artwork}
          src={art}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </span>
  );
}

export default function SideQuests({
  active = true,
  rotation,
}: {
  active?: boolean;
  rotation: Rotation;
}) {
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
      const ladders = Array.from(
        node.querySelectorAll<HTMLElement>("[data-ladder]"),
      );

      gsap.set(ladders, { "--fill": "0%" });

      tl.to(
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
        0,
      )
        .from(
          "[data-chid]",
          { opacity: 0, y: -6, duration: 0.3, stagger: 0.09 },
          0.08,
        )
        .from(
          "[data-chname]",
          { opacity: 0, x: -8, duration: 0.34, stagger: 0.09 },
          0.72,
        )
        .from(
          "[data-chval]",
          { opacity: 0, y: 7, duration: 0.32, stagger: 0.05 },
          0.8,
        )
        .from("[data-peak]", { opacity: 0, duration: 0.22, stagger: 0.13 }, 0.94)
        .from("[data-target]", { opacity: 0, duration: 0.3 }, 1.06)
        .from("[data-out]", { opacity: 0, x: -8, duration: 0.34 }, 1.2);

      ladders.forEach((rail, i) => {
        const steps = Number(rail.dataset.steps);
        const rungs = Number(rail.dataset.on);
        const level = { on: 0 };

        tl.to(
          level,
          {
            on: rungs,
            duration: 0.74,
            snap: { on: 1 },
            onUpdate: () => {
              rail.style.setProperty(
                "--fill",
                `${(level.on / steps) * 100}%`,
              );
            },
          },
          0.18 + i * 0.13,
        );
      });

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
                <div className={styles.rig} ref={rig}>
                  <div className={styles.masthead}>
                    <div className={styles.readout}>
                      <span className={styles.tag}>Total</span>
                      <span className={styles.tally}>
                        <span className={styles.count} data-count>
                          {TOTAL}
                        </span>
                        <span className={styles.unit}>lbs</span>
                      </span>
                    </div>

                    <div className={styles.target}>
                      <span className={styles.tag}>Target</span>
                      <span className={styles.targetVal} data-target>
                        {GOAL}
                      </span>
                      <span className={styles.out} data-out>
                        {GAP} lbs out
                      </span>
                    </div>
                  </div>

                  <div className={styles.channels}>
                    {CHANNELS.map((channel) => (
                      <div className={styles.channel} key={channel.name}>
                        <span className={styles.chId} data-chid>
                          {channel.id}
                        </span>
                        <div
                          className={styles.ladder}
                          data-ladder
                          data-on={channel.on}
                          data-steps={STEPS}
                          style={
                            { "--fill": lit(channel.on, STEPS) } as CSSProperties
                          }
                          aria-hidden="true"
                        >
                          <span className={styles.rungs} />
                          <span className={styles.lit} />
                          <span className={styles.peak} data-peak />
                        </div>
                        <div className={styles.chFoot}>
                          <span className={styles.chName} data-chname>
                            {channel.name}
                          </span>
                          <span className={styles.chLbs} data-chval>
                            {channel.lbs}
                          </span>
                          <span className={styles.chKg} data-chval>
                            {channel.kg} kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.master}>
                    <span className={styles.tag}>Master</span>
                    <div
                      className={styles.busTrack}
                      data-ladder
                      data-on={BUS_ON}
                      data-steps={BUS_STEPS}
                      style={
                        { "--fill": lit(BUS_ON, BUS_STEPS) } as CSSProperties
                      }
                      aria-hidden="true"
                    >
                      <span className={styles.busRungs} />
                      <span className={styles.busLit} />
                    </div>
                    <span className={styles.tag}>{GOAL}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.rotation}>
                  <section className={styles.wing} aria-label="Top tracks">
                    <h3 className={styles.wingHead}>
                      <span>Tracks</span>
                      <span className={styles.unitLabel}>Plays</span>
                    </h3>
                    <ol className={styles.list}>
                      {rotation.tracks.map((track, i) => (
                        <li
                          key={`${track.rank}-${track.title}`}
                          className={styles.slot}
                          style={{ "--i": i } as CSSProperties}
                        >
                          <Cell link={track.link} shape={styles.cut}>
                            <span className={styles.rank}>
                              {pad(track.rank)}
                            </span>
                            <Sleeve art={track.art} />
                            <span className={styles.names}>
                              <span className={styles.lead}>{track.title}</span>
                              <span className={styles.sub}>{track.artist}</span>
                            </span>
                            <span className={styles.plays}>
                              {track.plays > 0 ? track.plays : "—"}
                            </span>
                          </Cell>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section
                    className={`${styles.wing} ${styles.faces}`}
                    aria-label="Top artists"
                  >
                    <h3 className={styles.wingHead}>
                      <span>Artists</span>
                      <span className={styles.unitLabel}>Plays</span>
                    </h3>
                    <ol className={styles.list}>
                      {rotation.artists.map((artist, i) => (
                        <li
                          key={`${artist.rank}-${artist.name}`}
                          className={styles.slot}
                          style={
                            {
                              "--i": rotation.tracks.length + i,
                            } as CSSProperties
                          }
                        >
                          <Cell link={artist.link} shape={styles.face}>
                            <span className={styles.rank}>
                              {pad(artist.rank)}
                            </span>
                            <Sleeve art={artist.art} big />
                            <span className={styles.names}>
                              <span className={styles.lead}>{artist.name}</span>
                            </span>
                            <span className={styles.plays}>
                              {artist.plays > 0 ? artist.plays : "—"}
                            </span>
                          </Cell>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              )}

              <span className={styles.status}>
                <span className={styles.caret} aria-hidden="true" />
                {item.id === "music" ? stamp(rotation) : item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
