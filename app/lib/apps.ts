import type { Segment } from "@/app/components/Emphasis";
import type { TintKey } from "@/app/components/Wash";

export type Slug = "wandr" | "saldo" | "aquasense";

export type Feature = { title: string; body: string };
export type Video = { id: string; caption: string; runtime: string };
export type Spec = { group: string; rows: [string, string][] };
export type Plate = { n: string; caption: string; calls: string[] };
export type Privacy = { row: string; cells: boolean[] };
export type Release = {
  version: string;
  date: string;
  entries: { mark: "+" | "−" | "×"; text: string }[];
};

export type App = {
  slug: Slug;
  part: string;
  title: string;
  wordmark: string;
  tint: TintKey;
  lite: string;
  hot: string;
  hotInk: string;
  repo: string;
  repoHost: string;
  claim: string;
  meta: string[];
  tech: string[];
  note: Segment[];
  awards: string[];
  video?: Video;
  features: Feature[];
  highlights: string[];
  specs: Spec[];
  derived: { value: string; gloss: string };
  plates: Plate[];
  privacy: Privacy[];
  privacyLine: string;
  log: Release[];
};

export const PRIVACY_COLS = [
  "used to track you",
  "linked to you",
  "not linked to you",
];

export const APPS: App[] = [
  {
    slug: "wandr",
    part: "AJ–01",
    title: "Wandr",
    wordmark: "wandr",
    tint: "wandr",
    lite: "var(--wandr-lite)",
    hot: "var(--wandr-lite)",
    hotInk: "var(--ink)",
    repo: "https://github.com/aryamanraj2/Wandr",
    repoHost: "github.com",
    claim: "A GROUP CHAT, RESOLVED INTO A PLAN",
    meta: ["ios", "lifestyle", "swift"],
    tech: [
      "Swift",
      "SwiftUI",
      "Foundation Models",
      "App Intents",
      "Natural Language",
      "Evaluations Framework",
    ],
    note: [
      "Turns a group chat into ",
      { kw: "a decided night out" },
      ". A seven-stage pipeline pulls intent from a Siri summary, researches live venues, and resolves conflicts down a constraint ladder that relaxes budget before it ever touches dietary or accessibility. The model only ranks; deterministic code alone mints the plan, and the chat itself is never stored.",
    ],
    awards: [],
    video: {
      id: "",
      caption: "a group chat resolved end to end",
      runtime: "—:—",
    },
    features: [
      {
        title: "seven stages, one plan",
        body: "Intent, expansion, research, filter, rank, resolve, mint. Each stage hands the next a typed value, never a paragraph. A stage that fails hands back the last good result rather than a guess.",
      },
      {
        title: "intent, lifted from a summary",
        body: "The app never reads the thread. Siri hands over a summary, the model turns that into a constraint set, and the constraint set is the only thing that travels forward.",
      },
      {
        title: "live venues, not a cached list",
        body: "Candidates are pulled at request time and scored against the constraint set. A venue that closed an hour ago cannot win, because it was never in the pool.",
      },
      {
        title: "the constraint ladder",
        body: "When nothing satisfies everyone, constraints relax in a fixed order. Budget gives first, then distance, then cuisine. Dietary and accessibility sit below the last rung and never move.",
      },
      {
        title: "the model ranks, it never decides",
        body: "Ranking is the only place a language model touches the outcome. The plan itself is minted by deterministic code from the ranked list, so the same inputs always mint the same night.",
      },
      {
        title: "nothing is kept",
        body: "No thread, no summary, no constraint set survives the request. The plan is written to the device and the working set is dropped.",
      },
    ],
    highlights: [
      "SEVEN DETERMINISTIC STAGES, ONE LANGUAGE MODEL",
      "DIETARY AND ACCESSIBILITY NEVER RELAX",
      "THE CHAT IS NEVER STORED",
    ],
    specs: [
      {
        group: "the pipeline",
        rows: [
          ["stages", "7"],
          ["candidates per run", "≤ 40"],
          ["median resolve", "3.4 s"],
          ["fallback depth", "2"],
          ["determinism", "inputs → same plan"],
        ],
      },
      {
        group: "the ladder",
        rows: [
          ["rungs", "5"],
          ["relaxes first", "budget"],
          ["relaxes last", "cuisine"],
          ["never relaxes", "dietary · accessibility"],
          ["conflict passes", "≤ 3"],
        ],
      },
      {
        group: "on device",
        rows: [
          ["model", "Apple Foundation Models"],
          ["ranking context", "4 096 tokens"],
          ["network calls", "venue lookup only"],
          ["chat retained", "none"],
          ["minimum", "iOS 26"],
        ],
      },
    ],
    derived: { value: "0", gloss: "messages the app has ever stored" },
    plates: [
      {
        n: "01",
        caption: "the summary arrives",
        calls: [
          "siri hands over a summary, never the thread",
          "constraint set assembled before any network call",
          "six participants, four hard constraints",
        ],
      },
      {
        n: "02",
        caption: "the ladder resolving",
        calls: [
          "budget relaxed by one rung",
          "dietary constraint held, shown locked",
          "three candidates survive the pass",
        ],
      },
      {
        n: "03",
        caption: "the minted plan",
        calls: [
          "written by deterministic code, not the model",
          "each stop carries the constraint it satisfied",
          "working set dropped on dismiss",
        ],
      },
    ],
    privacy: [
      { row: "Location", cells: [false, false, true] },
      { row: "User Content", cells: [false, false, false] },
      { row: "Identifiers", cells: [false, false, false] },
      { row: "Usage Data", cells: [false, false, false] },
      { row: "Diagnostics", cells: [false, false, false] },
    ],
    privacyLine: "NOTHING LEAVES THE DEVICE BUT A VENUE QUERY",
    log: [
      {
        version: "0.4.0",
        date: "2026-07-14",
        entries: [
          { mark: "+", text: "constraint ladder made inspectable mid-resolve" },
          { mark: "+", text: "evaluation suite over 120 recorded group chats" },
          { mark: "×", text: "ranking no longer re-runs on scroll" },
        ],
      },
      {
        version: "0.3.0",
        date: "2026-05-02",
        entries: [
          { mark: "+", text: "App Intents entry point" },
          { mark: "−", text: "dropped the cached venue list entirely" },
          { mark: "×", text: "stage 4 no longer drops accessibility flags" },
        ],
      },
      {
        version: "0.2.0",
        date: "2026-03-19",
        entries: [
          { mark: "+", text: "seven-stage pipeline replaces the single prompt" },
          { mark: "−", text: "removed thread access" },
        ],
      },
      {
        version: "0.1.0",
        date: "2026-02-01",
        entries: [{ mark: "+", text: "first build" }],
      },
    ],
  },
  {
    slug: "saldo",
    part: "AJ–02",
    title: "Saldo",
    wordmark: "saldo",
    tint: "saldo",
    lite: "var(--saldo-lite)",
    hot: "var(--saldo-lite)",
    hotInk: "var(--ink)",
    repo: "https://github.com/aryamanraj2/Saldo",
    repoHost: "github.com",
    claim: "AN INTERFACE THAT REPAINTS AS THE BALANCE MOVES",
    meta: ["ios", "finance", "swift"],
    tech: [
      "Swift",
      "SwiftUI",
      "Vision",
      "Natural Language",
      "Foundation Models",
    ],
    note: [
      "A student budgeting app that ",
      { kw: "reacts to your balance" },
      " — a theming engine maps what is left to a palette and repaints the whole interface as the number moves. Receipts are read straight off the camera, goal images are cut from their background on device, and every insight is computed against a store that never leaves the phone. It won Apple's ",
      { kw: "Swift Student Challenge 2026" },
      ".",
    ],
    awards: ["Winner, Apple Swift Student Challenge 2026"],
    features: [
      {
        title: "the balance is the theme",
        body: "A single number drives the palette. Comfortable months are cool and quiet; the closer the balance runs to zero the warmer and denser the interface becomes. Nothing scolds you — the room just changes temperature.",
      },
      {
        title: "receipts, read off the camera",
        body: "Point at a receipt and Vision lifts the line items. Merchant, total and date resolve on device; anything ambiguous is left blank rather than filled with a plausible number.",
      },
      {
        title: "goals you can see",
        body: "Drop in a photo of the thing you are saving for and the subject is cut from its background on device. The goal card carries the object, not a stock icon.",
      },
      {
        title: "insight without a server",
        body: "Every trend, forecast and category rollup is computed against the local store. There is no account, no sync and no endpoint to compromise.",
      },
      {
        title: "built for a student month",
        body: "The model assumes irregular income, one heavy week and three light ones. Forecasts are anchored to the next inflow rather than to a calendar month.",
      },
    ],
    highlights: [
      "THE WHOLE INTERFACE REPAINTS FROM ONE NUMBER",
      "RECEIPTS RESOLVE ON DEVICE, IN VISION",
      "NO ACCOUNT, NO SYNC, NO SERVER",
    ],
    specs: [
      {
        group: "the theming engine",
        rows: [
          ["palettes", "6"],
          ["interpolation", "continuous"],
          ["repaint", "on balance write"],
          ["surfaces themed", "all"],
          ["reduce motion", "cross-fade only"],
        ],
      },
      {
        group: "capture",
        rows: [
          ["receipt OCR", "Vision, on device"],
          ["fields lifted", "merchant · total · date"],
          ["ambiguous fields", "left blank"],
          ["subject lift", "on device"],
          ["images uploaded", "none"],
        ],
      },
      {
        group: "the store",
        rows: [
          ["persistence", "local only"],
          ["accounts", "none"],
          ["network calls", "none"],
          ["export", "user-initiated"],
          ["minimum", "iOS 26"],
        ],
      },
    ],
    derived: { value: "0", gloss: "network calls the app is capable of making" },
    plates: [
      {
        n: "01",
        caption: "the palette at a comfortable balance",
        calls: [
          "palette 2 of 6, interpolated",
          "forecast anchored to the next inflow",
          "no figure is rounded for effect",
        ],
      },
      {
        n: "02",
        caption: "the same screen, three weeks later",
        calls: [
          "palette 5 of 6, same layout",
          "repaint triggered by the balance write",
          "nothing is hidden, only recoloured",
        ],
      },
      {
        n: "03",
        caption: "a receipt resolving",
        calls: [
          "vision pass completes on device",
          "merchant and total lifted, tip left blank",
          "image discarded after the write",
        ],
      },
    ],
    privacy: [
      { row: "Financial Info", cells: [false, false, false] },
      { row: "User Content", cells: [false, false, false] },
      { row: "Identifiers", cells: [false, false, false] },
      { row: "Usage Data", cells: [false, false, false] },
      { row: "Diagnostics", cells: [false, false, false] },
    ],
    privacyLine: "NO DATA COLLECTED. NONE.",
    log: [
      {
        version: "1.0.0",
        date: "2026-04-22",
        entries: [
          { mark: "+", text: "submitted to the Swift Student Challenge" },
          { mark: "+", text: "sixth palette for the last week of a month" },
          { mark: "×", text: "repaint no longer drops a frame on large ledgers" },
        ],
      },
      {
        version: "0.6.0",
        date: "2026-03-08",
        entries: [
          { mark: "+", text: "on-device subject lift for goal images" },
          { mark: "×", text: "receipt totals no longer guess at a missing tip" },
        ],
      },
      {
        version: "0.4.0",
        date: "2026-01-30",
        entries: [
          { mark: "+", text: "receipt capture via Vision" },
          { mark: "−", text: "removed the optional iCloud store" },
        ],
      },
      {
        version: "0.1.0",
        date: "2025-12-11",
        entries: [{ mark: "+", text: "first build" }],
      },
    ],
  },
  {
    slug: "aquasense",
    part: "AJ–03",
    title: "AquaSense",
    wordmark: "aquasense",
    tint: "aqua",
    lite: "var(--aqua-lite)",
    hot: "var(--aqua-dark)",
    hotInk: "var(--bone)",
    repo: "https://devfolio.co/projects/aquacult-5794",
    repoHost: "devfolio.co",
    claim: "THE CLASSIFIER OWNS THE VERDICT",
    meta: ["ios · android", "utilities", "swift · kotlin"],
    tech: [
      "Swift",
      "Vision",
      "LangChain",
      "Flask",
      "Gemini API",
      "Random Forest",
      "Kotlin",
    ],
    note: [
      "Aquarium care where ",
      { kw: "the classifier owns the verdict" },
      " and the model only explains it — water readings are scored first, so the language layer can phrase a result but never invent one. Three routable specialists split the work: live telemetry, image diagnosis from a photo of the fish, and a remediation cart assembled from whatever just got flagged. It took ",
      { kw: "Best Overall Project" },
      " and ",
      { kw: "Best Use of Gemini" },
      " at an MLH hackathon, with a runner-up finish for UI/UX.",
    ],
    awards: [
      "Best Overall Project, MLH Hackathon",
      "Best Use of Gemini, MLH Hackathon",
      "Runner-up, UI/UX",
    ],
    video: {
      id: "",
      caption: "the hackathon demo, unedited",
      runtime: "—:—",
    },
    features: [
      {
        title: "the verdict comes first",
        body: "A random forest scores the water panel before any text is generated. The language layer receives a decided result and is asked to phrase it — it is never asked what is wrong.",
      },
      {
        title: "three specialists, one router",
        body: "Telemetry, diagnosis and remediation are separate agents with separate tools. The router picks one. None of them can answer outside its own surface.",
      },
      {
        title: "a photo of the fish",
        body: "Image diagnosis runs against a fixed label set. An unrecognised condition returns unrecognised rather than the nearest match.",
      },
      {
        title: "the cart assembles itself",
        body: "Whatever the panel flagged becomes a remediation list with quantities derived from tank volume. Nothing is recommended that no reading called for.",
      },
      {
        title: "two clients, one backend",
        body: "Swift and Kotlin clients speak to the same Flask service. The scoring model lives server-side so both platforms see an identical verdict.",
      },
    ],
    highlights: [
      "A RANDOM FOREST DECIDES, THE MODEL ONLY EXPLAINS",
      "THREE ROUTABLE SPECIALISTS, NO SHARED TOOLBOX",
      "AN UNKNOWN CONDITION RETURNS UNKNOWN",
    ],
    specs: [
      {
        group: "the verdict path",
        rows: [
          ["classifier", "random forest"],
          ["panel inputs", "7"],
          ["verdict source", "classifier only"],
          ["model role", "phrasing"],
          ["override", "not permitted"],
        ],
      },
      {
        group: "the specialists",
        rows: [
          ["agents", "3"],
          ["routing", "single-hop"],
          ["shared tools", "none"],
          ["image label set", "fixed"],
          ["unknown handling", "returns unknown"],
        ],
      },
      {
        group: "the stack",
        rows: [
          ["clients", "Swift · Kotlin"],
          ["service", "Flask"],
          ["orchestration", "LangChain"],
          ["language model", "Gemini API"],
          ["vision", "on device"],
        ],
      },
    ],
    derived: { value: "3", gloss: "awards from one weekend" },
    plates: [
      {
        n: "01",
        caption: "the panel, scored",
        calls: [
          "seven readings enter, one verdict leaves",
          "the classifier has already decided here",
          "phrasing is requested after the fact",
        ],
      },
      {
        n: "02",
        caption: "diagnosis from a photo",
        calls: [
          "fixed label set, no nearest-match fallback",
          "confidence shown, never rounded up",
          "an unrecognised fish returns unrecognised",
        ],
      },
      {
        n: "03",
        caption: "the remediation cart",
        calls: [
          "assembled only from flagged readings",
          "quantities derived from tank volume",
          "nothing suggested that nothing called for",
        ],
      },
    ],
    privacy: [
      { row: "User Content", cells: [false, true, false] },
      { row: "Identifiers", cells: [false, true, false] },
      { row: "Usage Data", cells: [false, false, true] },
      { row: "Diagnostics", cells: [false, false, true] },
      { row: "Location", cells: [false, false, false] },
    ],
    privacyLine: "PHOTOS AND READINGS REACH A SERVER. NOTHING IS SOLD.",
    log: [
      {
        version: "0.3.0",
        date: "2025-11-09",
        entries: [
          { mark: "+", text: "remediation cart derived from tank volume" },
          { mark: "×", text: "router no longer falls through to diagnosis" },
        ],
      },
      {
        version: "0.2.0",
        date: "2025-11-08",
        entries: [
          { mark: "+", text: "Kotlin client against the same service" },
          { mark: "−", text: "removed the model's ability to name a condition" },
        ],
      },
      {
        version: "0.1.0",
        date: "2025-11-07",
        entries: [{ mark: "+", text: "first build, hackathon weekend" }],
      },
    ],
  },
];

export const bySlug = (slug: string) => APPS.find((app) => app.slug === slug);

export const others = (slug: string) => APPS.filter((app) => app.slug !== slug);
