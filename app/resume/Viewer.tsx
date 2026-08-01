"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Minus, Plus, RotateCcw } from "lucide-react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist/types/src/display/api";
import styles from "./Viewer.module.css";

type Hotspot = {
  url: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type Sheet = {
  number: number;
  ratio: number;
  hotspots: Hotspot[];
};

type Status = "loading" | "ready" | "error";

const MAX_DPR = 2.5;
const MAX_CANVAS = 4096;
const MAX_PIXELS = 16_000_000;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const STEP = 1.25;

const clampZoom = (value: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));

export default function Viewer({
  file,
  downloadAs,
}: {
  file: string;
  downloadAs: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [painted, setPainted] = useState(false);
  const [enter, setEnter] = useState(false);
  const [zoom, setZoom] = useState(1);

  const doc = useRef<PDFDocumentProxy | null>(null);
  const loader = useRef<PDFDocumentLoadingTask | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvases = useRef(new Map<number, HTMLCanvasElement>());
  const fetched = useRef<string | null>(null);

  const nudge = useCallback((factor: number) => {
    setZoom((current) => clampZoom(current * factor));
  }, []);

  const reset = useCallback(() => {
    setZoom(1);
    stage.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "+" || event.key === "=") nudge(STEP);
      else if (event.key === "-") nudge(1 / STEP);
      else if (event.key === "0") reset();
      else return;
      event.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, reset]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (fetched.current === file) return;
    fetched.current = file;

    const link = document.createElement("a");
    link.href = file;
    link.download = downloadAs;
    link.rel = "noopener";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [file, downloadAs]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const task = pdfjs.getDocument({ url: file });
        loader.current = task;

        const loaded = await task.promise;
        if (cancelled) return;
        doc.current = loaded;

        const next: Sheet[] = [];
        for (let n = 1; n <= loaded.numPages; n++) {
          const page = await loaded.getPage(n);
          const view = page.getViewport({ scale: 1 });
          const annotations = await page.getAnnotations({ intent: "display" });

          const hotspots = annotations
            .filter((a) => a.subtype === "Link" && typeof a.url === "string")
            .map((a) => {
              const [x1, y1] = view.convertToViewportPoint(a.rect[0], a.rect[1]);
              const [x2, y2] = view.convertToViewportPoint(a.rect[2], a.rect[3]);
              return {
                url: a.url as string,
                left: Math.min(x1, x2) / view.width,
                top: Math.min(y1, y2) / view.height,
                width: Math.abs(x2 - x1) / view.width,
                height: Math.abs(y2 - y1) / view.height,
              };
            });

          next.push({ number: n, ratio: view.width / view.height, hotspots });
        }

        if (cancelled) return;
        setSheets(next);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    load();

    return () => {
      cancelled = true;
      doc.current = null;
      loader.current?.destroy();
      loader.current = null;
    };
  }, [file]);

  useEffect(() => {
    if (!sheets.length) return;

    let frame = 0;
    let disposed = false;
    const tasks = new Map<number, RenderTask>();
    const widths = new Map<number, number>();

    const paint = async () => {
      const source = doc.current;
      if (!source || disposed) return;

      for (const sheet of sheets) {
        const canvas = canvases.current.get(sheet.number);
        if (!canvas) continue;

        const width = canvas.getBoundingClientRect().width;
        if (width < 1 || widths.get(sheet.number) === width) continue;

        tasks.get(sheet.number)?.cancel();
        widths.set(sheet.number, width);

        const page = await source.getPage(sheet.number);
        if (disposed) return;

        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(
          (width * dpr) / base.width,
          MAX_CANVAS / base.width,
          Math.sqrt(MAX_PIXELS / (base.width * base.height))
        );
        const viewport = page.getViewport({ scale });

        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const task = page.render({ canvas, viewport });
        tasks.set(sheet.number, task);

        try {
          await task.promise;
        } catch {
          widths.delete(sheet.number);
          continue;
        }

        if (!disposed) setPainted(true);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        paint();
      });
    };

    const measure = (entry?: ResizeObserverEntry) => {
      const node = stage.current;
      if (!node) return;
      const height = entry?.contentRect.height ?? node.clientHeight;
      node.style.setProperty("--stage-h", `${Math.round(height)}px`);
    };

    const observer = new ResizeObserver(([entry]) => {
      measure(entry);
      schedule();
    });
    if (stage.current) observer.observe(stage.current);
    measure();
    schedule();

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      tasks.forEach((task) => task.cancel());
    };
  }, [sheets, zoom]);

  return (
    <div className={`${styles.root} ${enter ? styles.enter : ""}`}>
      <header className={styles.bar}>
        <h1 className={styles.title}>
          résumé
          {sheets.length > 1 ? (
            <span className={styles.count}> · {sheets.length} pages</span>
          ) : null}
        </h1>
        <a className={styles.action} href={file} download={downloadAs}>
          <span className={styles.actionLabel}>download</span>
          <span className={styles.arrow}>
            <Download size={15} strokeWidth={1.8} />
          </span>
        </a>
      </header>

      <main className={styles.stage} ref={stage}>
        {status === "error" ? (
          <div className={styles.fallback}>
            <p className={styles.fallbackText}>
              This document didn&rsquo;t want to render here.
            </p>
            <a className={styles.action} href={file} download={downloadAs}>
              <span className={styles.actionLabel}>download the pdf</span>
              <span className={styles.arrow}>
                <Download size={15} strokeWidth={1.8} />
              </span>
            </a>
          </div>
        ) : (
          <div className={`${styles.doc} ${painted ? styles.visible : ""}`}>
            {sheets.map((sheet) => (
              <div
                key={sheet.number}
                className={styles.page}
                style={
                  { "--ratio": sheet.ratio, "--zoom": zoom } as React.CSSProperties
                }
              >
                <canvas
                  className={styles.canvas}
                  aria-label={`Résumé page ${sheet.number}`}
                  role="img"
                  ref={(node) => {
                    if (node) canvases.current.set(sheet.number, node);
                    else canvases.current.delete(sheet.number);
                  }}
                />
                {sheet.hotspots.map((spot, i) => (
                  <a
                    key={i}
                    className={styles.hotspot}
                    href={spot.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      left: `${spot.left * 100}%`,
                      top: `${spot.top * 100}%`,
                      width: `${spot.width * 100}%`,
                      height: `${spot.height * 100}%`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {status !== "error" && !painted ? (
          <p className={`${styles.status} ${painted ? styles.gone : ""}`}>
            loading
          </p>
        ) : null}
      </main>

      {status === "ready" ? (
        <div className={`${styles.island} ${painted ? styles.afloat : ""}`}>
          <button
            type="button"
            className={styles.control}
            onClick={() => nudge(1 / STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
          >
            <Minus size={15} strokeWidth={2} />
          </button>
          <span className={styles.readout}>{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className={styles.control}
            onClick={() => nudge(STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
          >
            <Plus size={15} strokeWidth={2} />
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={styles.control}
            onClick={reset}
            disabled={zoom === 1}
            aria-label="Reset zoom"
          >
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
