import { ImageResponse } from "next/og";
import { GREETING, SITE_URL } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#000000";
const BONE = "#fffff0";
const NEON = "#edff00";

const STACK = "Swift · SwiftUI · Kotlin · on-device AI";

const FONT_CSS =
  "https://api.fontshare.com/v2/css?f[]=satoshi@500,900&display=swap";

type Face = { data: ArrayBuffer; weight: 500 | 900 };

const parse = (css: string) =>
  [...css.matchAll(/@font-face\s*{([^}]*)}/g)].flatMap((block) => {
    const url = block[1].match(/url\('([^']+\.ttf)'\)/)?.[1];
    const weight = Number(block[1].match(/font-weight:\s*(\d+)/)?.[1]);
    return url && (weight === 500 || weight === 900)
      ? [{ url: `https:${url}`, weight: weight as 500 | 900 }]
      : [];
  });

const load = async (): Promise<Face[]> => {
  try {
    const css = await fetch(FONT_CSS).then((r) => {
      if (!r.ok) throw new Error(`fontshare css ${r.status}`);
      return r.text();
    });

    return await Promise.all(
      parse(css).map(async ({ url, weight }) => ({
        weight,
        data: await fetch(url).then((r) => {
          if (!r.ok) throw new Error(`fontshare ttf ${r.status}`);
          return r.arrayBuffer();
        }),
      })),
    );
  } catch (error) {
    console.warn("[og] Satoshi unavailable, falling back to system sans:", error);
    return [];
  }
};

let cached: Promise<Face[]> | null = null;
const satoshi = () => (cached ??= load());

export async function ogCard(sub: string) {
  const faces = await satoshi();
  const family = faces.length ? "Satoshi" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: BONE,
          padding: 80,
          fontFamily: family,
        }}
      >
        <div style={{ display: "flex", width: 34, height: 34, background: NEON }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {GREETING}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              maxWidth: 880,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              opacity: 0.56,
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${BONE}`,
            paddingTop: 28,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 900 }}>
            {SITE_URL.replace("https://", "")}
          </div>
          <div style={{ display: "flex", fontWeight: 500, opacity: 0.46 }}>
            {STACK}
          </div>
        </div>
      </div>
    ),
    faces.length
      ? {
          ...OG_SIZE,
          fonts: faces.map((face) => ({
            name: "Satoshi",
            data: face.data,
            weight: face.weight,
            style: "normal" as const,
          })),
        }
      : OG_SIZE,
  );
}
