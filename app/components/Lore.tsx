"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import styles from "./Lore.module.css";

type Kind = "experience" | "education" | "achievement";

type Entry = {
  kind: Kind;
  title: string;
  org?: string;
  period: string;
  note?: string;
};

const ENTRIES: Entry[] = [
  {
    kind: "achievement",
    title: "Shipped 3 apps to the App Store",
    period: "2025",
    note: "Native iOS releases with on-device AI, live for real users.",
  },
  {
    kind: "achievement",
    title: "Best Mobile App — National Hackathon",
    period: "2024",
    note: "Built and demoed a working prototype in 36 hours.",
  },
  {
    kind: "experience",
    title: "Freelance — iOS & Android",
    org: "Independent",
    period: "2023 — Now",
    note: "Native apps, the AI pipelines inside them, and the backends behind them.",
  },
  {
    kind: "experience",
    title: "Mobile Engineer Intern",
    org: "Early-stage Startup",
    period: "2023",
    note: "Owned features across the mobile client and API.",
  },
  {
    kind: "education",
    title: "B.Tech, Computer Science",
    org: "University",
    period: "2022 — Now",
    note: "Systems, machine learning, and a lot of side projects.",
  },
];

const isAchievement = (kind: Kind) => kind === "achievement";

type LoreProps = {
  scroller: RefObject<HTMLDivElement | null>;
  active: boolean;
};

export default function Lore({ scroller, active }: LoreProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scrollerEl = scroller.current;
    if (!root || !scrollerEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const st = (config: ScrollTrigger.Vars): ScrollTrigger.Vars => ({
        scroller: scrollerEl,
        ...config,
      });

      gsap.from("[data-title]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: st({ trigger: "[data-title]", start: "top 90%" }),
      });

      const spine = root.querySelector("[data-spine]");
      const timeline = root.querySelector("[data-timeline]");
      if (spine && timeline) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: st({
              trigger: timeline,
              start: "top 75%",
              end: "bottom 75%",
              scrub: true,
            }),
          }
        );
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: st({
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }),
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [scroller]);

  useEffect(() => {
    if (active) ScrollTrigger.refresh();
  }, [active]);

  return (
    <section ref={rootRef} className={styles.lore} aria-label="Lore">
      <div className={styles.inner}>
        <h2 className={styles.title} data-title>
          Lore
        </h2>
        <div className={styles.timeline} data-timeline>
          <span className={styles.spine} data-spine aria-hidden="true" />
          {ENTRIES.map((entry, i) => {
            const rowClass = `${styles.row} ${
              isAchievement(entry.kind) ? styles.standout : ""
            }`;
            return (
              <div key={i} className={rowClass} data-row>
                <span className={styles.node} data-node aria-hidden="true" />
                <div className={styles.connectorContainer}>
                  <span className={styles.connector} data-connector aria-hidden="true" />
                  <ArrowRight className={styles.arrowIcon} data-arrow />
                </div>
                <article className={styles.card} data-card>
                  <span className={styles.kind}>{entry.kind}</span>
                  <h3 className={styles.role}>{entry.title}</h3>
                  {entry.org && <span className={styles.org}>{entry.org}</span>}
                  <span className={styles.period}>{entry.period}</span>
                  {entry.note && <p className={styles.note}>{entry.note}</p>}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
