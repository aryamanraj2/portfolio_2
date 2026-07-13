"use client";

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./AnimeScrollBar.module.css";

type ScrollState = {
  progress: number;
  thumbX: number;
  scrollable: boolean;
};

const TICK_COUNT = 45;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function AnimeScrollBar({
  targetRef,
  active,
}: {
  targetRef: RefObject<HTMLElement | null>;
  active: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    thumbX: 0,
    scrollable: false,
  });
  const ticks = useMemo(() => Array.from({ length: TICK_COUNT }, (_, i) => i), []);

  const getTravel = useCallback(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return 0;
    return Math.max(0, rail.clientWidth - thumb.offsetWidth);
  }, []);

  const sync = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;
    const max = target.scrollHeight - target.clientHeight;
    const progress = max > 1 ? clamp(target.scrollTop / max) : 0;
    const travel = getTravel();
    setState({
      progress,
      thumbX: progress * travel,
      scrollable: max > 1,
    });
  }, [getTravel, targetRef]);

  const scrollToProgress = useCallback(
    (next: number) => {
      const target = targetRef.current;
      if (!target) return;
      const max = target.scrollHeight - target.clientHeight;
      target.scrollTop = clamp(next) * max;
      sync();
    },
    [sync, targetRef],
  );

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      const thumb = thumbRef.current;
      if (!rail || !thumb) return;
      const rect = rail.getBoundingClientRect();
      const travel = getTravel();
      const next = travel === 0 ? 0 : (clientX - rect.left - thumb.offsetWidth / 2) / travel;
      scrollToProgress(next);
    },
    [getTravel, scrollToProgress],
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let raf = 0;
    const requestSync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    requestSync();
    target.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    const observers: ResizeObserver[] = [];
    if (typeof ResizeObserver !== "undefined") {
      const targetObserver = new ResizeObserver(requestSync);
      targetObserver.observe(target);
      observers.push(targetObserver);

      if (railRef.current) {
        const railObserver = new ResizeObserver(requestSync);
        railObserver.observe(railRef.current);
        observers.push(railObserver);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sync, targetRef]);

  return (
    <div
      className={`${styles.wrap} ${active && state.scrollable ? styles.visible : ""}`}
      aria-hidden={!active || !state.scrollable}
    >
      <div
        className={styles.bar}
        role="scrollbar"
        aria-label="Page scroll"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(state.progress * 100)}
        tabIndex={active && state.scrollable ? 0 : -1}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging.current) updateFromPointer(event.clientX);
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onKeyDown={(event) => {
          const moves: Record<string, number> = {
            ArrowLeft: -0.08,
            ArrowDown: -0.08,
            ArrowRight: 0.08,
            ArrowUp: 0.08,
            PageDown: 0.22,
            PageUp: -0.22,
          };

          if (event.key === "Home") {
            event.preventDefault();
            scrollToProgress(0);
            return;
          }

          if (event.key === "End") {
            event.preventDefault();
            scrollToProgress(1);
            return;
          }

          if (event.key in moves) {
            event.preventDefault();
            scrollToProgress(state.progress + moves[event.key]);
          }
        }}
      >
        <div ref={railRef} className={styles.rail}>
          <span
            ref={thumbRef}
            className={styles.thumb}
            style={{ transform: `translate3d(${state.thumbX}px, -50%, 0)` }}
          />
          <span className={styles.ticks} aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick}
                className={`${styles.tick} ${tick % 6 === 0 ? styles.major : ""}`}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
