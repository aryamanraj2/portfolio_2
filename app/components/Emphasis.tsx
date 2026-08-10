"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type Segment = string | { kw: string };

const GAP = 2;
const LIT_IN = 200;
const LIT_OUT = 420;
const REMEASURE = 160;
const SWEEP = 560;
const GLIDES = "(hover: hover) and (pointer: fine)";

type Token =
  | { kind: "word"; text: string; base: number }
  | { kind: "kw"; chars: string[]; base: number };

type Node = { kind: "space"; text: string } | { kind: "cluster"; items: Token[] };

const build = (parts: Segment[]): { nodes: Node[]; span: number } => {
  const nodes: Node[] = [];
  let step = 0;
  let lead = 0;

  const push = (token: Token) => {
    const last = nodes[nodes.length - 1];
    if (last && last.kind === "cluster") last.items.push(token);
    else nodes.push({ kind: "cluster", items: [token] });
  };

  for (const part of parts) {
    if (typeof part === "string") {
      for (const token of part.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) nodes.push({ kind: "space", text: token });
        else push({ kind: "word", text: token, base: lead });
      }
      continue;
    }

    const chars = [...part.kw];
    push({ kind: "kw", chars, base: step });
    lead = step;
    step += chars.length + GAP;
  }

  return { nodes, span: Math.max(step - GAP, 0) };
};

export default function Emphasis({
  parts,
  play,
}: {
  parts: Segment[];
  play?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (!window.matchMedia(GLIDES).matches) return;

    let alive = true;
    let width = window.innerWidth;

    const flip = () => {
      if (!alive) return;
      if (!window.matchMedia(GLIDES).matches) return;
      const items = [...node.querySelectorAll<HTMLElement>(".kwChar, .kwWord")];
      for (const el of items) el.style.removeProperty("--dx");

      node.classList.add("kwStill");
      node.classList.add("kwRest");
      const rest = items.map((el) => el.getBoundingClientRect());
      node.classList.remove("kwRest");
      const bold = items.map((el) => el.getBoundingClientRect());
      node.classList.remove("kwStill");

      items.forEach((el, k) => {
        const sameLine = Math.abs(rest[k].top - bold[k].top) < 1;
        const dx = sameLine ? rest[k].left - bold[k].left : 0;
        if (Math.abs(dx) > 0.05) {
          el.style.setProperty("--dx", `${dx.toFixed(2)}px`);
        }
      });
    };

    flip();
    document.fonts?.ready.then(flip);

    let pending: ReturnType<typeof setTimeout>;
    const resize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      clearTimeout(pending);
      pending = setTimeout(flip, REMEASURE);
    };

    window.addEventListener("resize", resize);
    return () => {
      alive = false;
      window.removeEventListener("resize", resize);
      clearTimeout(pending);
    };
  }, []);

  useEffect(() => {
    if (play === undefined) return;
    const id = setTimeout(() => setLit(play), play ? LIT_IN : LIT_OUT);
    return () => clearTimeout(id);
  }, [play]);

  const content = useMemo(() => {
    const token = (item: Token, key: number) =>
      item.kind === "word" ? (
        <span
          key={key}
          className="kwWord"
          style={{ "--b": item.base } as CSSProperties}
        >
          {item.text}
        </span>
      ) : (
        <span key={key} className="kw">
          <span className="kwText">{item.chars.join("")}</span>
          {item.chars.map((char, j) => (
            <span
              key={j}
              aria-hidden="true"
              className="kwChar"
              data-c={char}
              style={{ "--b": item.base, "--i": item.base + j } as CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
      );

    const { nodes, span } = build(parts);
    const step = span
      ? `min(var(--kw-tick, 22ms), calc(${SWEEP}ms / ${span}))`
      : undefined;

    const flow = nodes.map((node, idx) => {
      if (node.kind === "space") {
        return <Fragment key={idx}>{node.text}</Fragment>;
      }

      if (node.items.length === 1) return token(node.items[0], idx);

      return (
        <span key={idx} className="kwHold">
          {node.items.map((item, j) => token(item, j))}
        </span>
      );
    });

    return { flow, step };
  }, [parts]);

  return (
    <span
      ref={root}
      className={play === undefined || lit ? "kwRun" : "kwRun kwIdle"}
      style={{ "--kw-step": content.step } as CSSProperties}
    >
      {content.flow}
    </span>
  );
}
