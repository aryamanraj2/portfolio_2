"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRevealed } from "@/app/lib/useRevealed";
import styles from "./Footer.module.css";

const SERIAL = "FTR–001";
const PANEL = "REAR PANEL";
const REV = "REV 2026.08";

const MAIL = "aryamanj250@gmail.com";

const CITY = "DELHI";
const ZONE = "Asia/Kolkata";
const ZONE_LABEL = "IST +05:30";
const COORDS = "28.61°N 77.21°E";
const WAKE = 9;
const SLEEP = 1;
const BLANK = "--:--:--";

const PHONE = "+91 9136816530";

const PORTS = [
  { label: "MAIL", handle: MAIL, href: `mailto:${MAIL}`, out: false },
  { label: "PHONE", handle: PHONE, href: "tel:+919136816530", out: false },
  {
    label: "LINKEDIN",
    handle: "/in/aryaman-jaiswal250",
    href: "https://www.linkedin.com/in/aryaman-jaiswal250",
    out: true,
  },
  {
    label: "X",
    handle: "@aryamaaaann",
    href: "https://x.com/aryamaaaann",
    out: true,
  },
  {
    label: "INSTAGRAM",
    handle: "@aryamanj_",
    href: "https://www.instagram.com/aryamanj_/",
    out: true,
  },
  {
    label: "GITHUB",
    handle: "/aryamanraj2",
    href: "https://github.com/aryamanraj2",
    out: true,
  },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TICKS = [0, 6, 12, 18];

const awake = (hour: number) => hour >= WAKE || hour < SLEEP;

const read = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const pick = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  const hh = pick("hour");
  return { time: `${hh}:${pick("minute")}:${pick("second")}`, hour: Number(hh) % 24 };
};

export default function Footer({ active = true }: { active?: boolean }) {
  const [ref, revealed] = useRevealed<HTMLElement>(0.15);
  const [clock, setClock] = useState<{ time: string; hour: number } | null>(null);

  useEffect(() => {
    const tick = () => setClock(read());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const up = clock ? awake(clock.hour) : false;
  const on = active && revealed;

  return (
    <footer
      ref={ref}
      className={`${styles.panel} ${on ? styles.active : ""}`}
    >
      <div className={styles.serial}>
        <span className={styles.stencil}>{SERIAL}</span>
        <span className={styles.stencil}>{PANEL}</span>
        <span className={styles.stencil}>{REV}</span>
      </div>
      <span className={styles.ruleDash} aria-hidden="true" />

      <div className={styles.deck}>
        <div className={styles.io}>
          <span className={styles.kicker}>say hello</span>
          <a className={styles.mail} href={`mailto:${MAIL}`}>
            <span className={styles.mailLabel}>{MAIL}</span>
          </a>

          <ul className={styles.ports}>
            {PORTS.map((port, i) => (
              <li key={port.label} className={styles.port}>
                <a
                  className={styles.jack}
                  href={port.href}
                  target={port.out ? "_blank" : undefined}
                  rel={port.out ? "noreferrer" : undefined}
                >
                  <span className={styles.rank}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.pip} aria-hidden="true" />
                  <span className={styles.portLabel}>{port.label}</span>
                  <span className={styles.handle}>{port.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.module}>
          <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

          <div className={styles.modHead}>
            <span className={styles.stencil}>LOCAL</span>
            <span className={styles.stencil}>{ZONE_LABEL}</span>
          </div>

          <span className={styles.time}>{clock ? clock.time : BLANK}</span>

          <div className={styles.place}>
            <span className={styles.city}>{CITY}</span>
            <span className={styles.coords}>{COORDS}</span>
          </div>

          <span className={styles.ruleDot} aria-hidden="true" />

          <div className={styles.day} aria-hidden="true">
            <div className={styles.bar}>
              {HOURS.map((hour) => (
                <span
                  key={hour}
                  className={styles.cell}
                  data-state={
                    clock && hour === clock.hour
                      ? "now"
                      : awake(hour)
                        ? "up"
                        : "down"
                  }
                />
              ))}
            </div>
            <div className={styles.ticks}>
              {TICKS.map((tick) => (
                <span
                  key={tick}
                  className={styles.tickLabel}
                  style={{ "--t": tick } as CSSProperties}
                >
                  {String(tick).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.status}>
            <span className={styles.led} data-up={up} aria-hidden="true" />
            <span className={styles.statusLabel}>
              {clock ? (up ? "PROBABLY UP" : "PROBABLY ASLEEP") : "SYNCING"}
            </span>
          </div>
        </div>
      </div>

      <span className={styles.grill} aria-hidden="true" />

      <div className={styles.baseline}>
        <span className={styles.stencil}>© 2026</span>
        <span className={styles.stencil}>BUILT IN DELHI</span>
      </div>

      <div className={styles.markWrap} aria-hidden="true">
        <svg
          className={styles.wordmark}
          viewBox="0 0 1000 82"
          preserveAspectRatio="xMidYMin meet"
        >
          <text x="0" y="100" textLength="1000" lengthAdjust="spacingAndGlyphs">
            ARYAMAN JAISWAL
          </text>
        </svg>
      </div>
    </footer>
  );
}
