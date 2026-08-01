"use client";

import { useEffect, useRef, useState } from "react";

export function useRevealed<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const watch = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setRevealed(true);
          observer?.disconnect();
        },
        { threshold, rootMargin: "0px 0px -18% 0px" }
      );
      observer.observe(node);
    };

    const start = () => {
      window.removeEventListener("scroll", start, true);
      frame = requestAnimationFrame(watch);
    };

    window.addEventListener("scroll", start, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", start, true);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return [ref, revealed] as const;
}
