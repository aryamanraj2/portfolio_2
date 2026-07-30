"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";

export type Segment = string | { kw: string };

const GAP = 2;

type Token =
  | { kind: "word"; text: string; base: number }
  | { kind: "kw"; chars: string[]; base: number };

type Node = { kind: "space"; text: string } | { kind: "cluster"; items: Token[] };

const build = (parts: Segment[]): Node[] => {
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

  return nodes;
};

export default function Emphasis({ parts }: { parts: Segment[] }) {
  const root = useRef<HTMLSpanElement>(null);
  const nodes = build(parts);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const flip = () => {
      const items = [...node.querySelectorAll<HTMLElement>(".kwChar, .kwWord")];
      for (const el of items) el.style.removeProperty("--dx");

      node.classList.add("kwRest");
      const rest = items.map((el) => el.getBoundingClientRect());
      node.classList.remove("kwRest");

      items.forEach((el, k) => {
        const now = el.getBoundingClientRect();
        const sameLine = Math.abs(rest[k].top - now.top) < 1;
        const dx = sameLine ? rest[k].left - now.left : 0;
        if (Math.abs(dx) > 0.05) {
          el.style.setProperty("--dx", `${dx.toFixed(2)}px`);
        }
      });
    };

    flip();
    document.fonts?.ready.then(flip);
  }, []);

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
        {item.chars.map((char, j) => (
          <span
            key={j}
            className="kwChar"
            data-c={char}
            style={{ "--b": item.base, "--i": item.base + j } as CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    );

  return (
    <span ref={root} className="kwRun">
      {nodes.map((node, idx) => {
        if (node.kind === "space") {
          return <Fragment key={idx}>{node.text}</Fragment>;
        }

        if (node.items.length === 1) return token(node.items[0], idx);

        return (
          <span key={idx} className="kwHold">
            {node.items.map((item, j) => token(item, j))}
          </span>
        );
      })}
    </span>
  );
}
