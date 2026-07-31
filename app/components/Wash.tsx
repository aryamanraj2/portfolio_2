"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import styles from "./Wash.module.css";

export type TintKey = "wandr" | "saldo" | "aqua";

export type WashHandle = { to: (key: TintKey | null) => void };

const WASH: Record<TintKey, string> = {
  wandr: "#15172e",
  saldo: "#121f10",
  aqua: "#0c1b28",
};

const INK = "#000000";
const SWITCH_MS = 560;
const CLEAR_MS = 820;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Rgb = [number, number, number];

const rgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const paint = (c: Rgb) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

const blend = (from: Rgb, to: Rgb, t: number): Rgb => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
  from[2] + (to[2] - from[2]) * t,
];

export default function Wash({ ref }: { ref?: Ref<WashHandle> }) {
  const baseEl = useRef<HTMLDivElement>(null);
  const flightEl = useRef<HTMLDivElement>(null);
  const key = useRef<TintKey | null>(null);
  const base = useRef<Rgb>(rgb(INK));
  const flight = useRef<Rgb>(rgb(INK));
  const anim = useRef<Animation | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      to(next) {
        if (next === key.current) return;

        const settled = baseEl.current;
        const rising = flightEl.current;
        if (!settled || !rising) return;

        const held = anim.current
          ? Number(getComputedStyle(rising).opacity) || 0
          : 0;

        base.current = blend(base.current, flight.current, held);
        settled.style.backgroundColor = paint(base.current);

        anim.current?.cancel();
        flight.current = rgb(next ? WASH[next] : INK);
        rising.style.backgroundColor = paint(flight.current);

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        anim.current = rising.animate([{ opacity: "0" }, { opacity: "1" }], {
          duration: reduce ? 1 : next ? SWITCH_MS : CLEAR_MS,
          easing: EASE,
          fill: "forwards",
        });

        key.current = next;
        document.documentElement.dataset.tint = next ?? "";
      },
    }),
    [],
  );

  useEffect(
    () => () => {
      anim.current?.cancel();
      delete document.documentElement.dataset.tint;
    },
    [],
  );

  return (
    <div className={styles.wash} aria-hidden="true">
      <div ref={baseEl} className={styles.layer} />
      <div ref={flightEl} className={`${styles.layer} ${styles.flight}`} />
    </div>
  );
}
