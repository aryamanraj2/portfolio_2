# TODO — app spec pages

The repo bans comments, so placeholder values are tracked here instead of inline.
Everything below lives in `app/lib/apps.ts` and is **invented**. Replace before
these pages go to `main`.

## Real, do not touch

`title` · `tint` · `lite` · `repo` · `tech` · `note` · `awards` — carried over
verbatim from the old `PROJECTS` const and `site.ts`. The three award lines are
genuine (Swift Student Challenge 2026, MLH Best Overall, MLH Best Use of Gemini).

## Placeholder — needs real values

| field | what is fake | how to fix |
| --- | --- | --- |
| `part` | AJ–01 / AJ–02 / AJ–03 | fine as-is unless the numbering should follow build order |
| `claim` | one-line caps assertion per app | rewrite in your own voice |
| `meta` | platform / category / language | verify AquaSense really shipped both clients |
| `features[].body` | all 5–6 paragraphs per app | these read as fact and are not — rewrite from the actual code |
| `highlights` | three caps lines per app | keep only claims the repo can back |
| `specs[].rows` | **every numeric value** | median resolve times, token counts, rung counts, panel inputs — all invented |
| `derived` | the big figure and its gloss | Wandr "0 messages stored" and Saldo "0 network calls" are probably true; verify |
| `plates[].caption` / `.calls` | all of them | rewrite once real screenshots exist |
| `log` | **every version and date** | replace with real git tags, or delete the section |
| `video.id` | **empty on both apps** | paste the YouTube video id (the part after `v=`) for Wandr and AquaSense |
| `video.caption` / `.runtime` | invented | runtime shows `—:—` until filled |

## Video

Wandr and AquaSense carry a `video` field; Saldo does not, and its section
numbering closes the gap automatically (Saldo runs 01–08, the other two 01–09).

`Reel.tsx` has three states driven by `video.id`:

- **empty id** — framed halftone placeholder, no play button. This is the state today.
- **id set, not clicked** — same frame plus a `▶ play` button. **No request is made
  to YouTube on page load**, not even for a thumbnail. This is deliberate: these
  pages carry a privacy matrix, and a stock embed would phone home before the
  visitor did anything.
- **clicked** — iframe against `youtube-nocookie.com` with `autoplay=1&rel=0`.

So filling in the id is the only step needed to go live.

## Screenshots

`plates` currently render an empty framed halftone at 9:19.5. When real captures
land:

1. drop them in `public/apps/<slug>/01.png` …
2. swap the placeholder `<div className={styles.shell + " halftone"} />` in
   `app/components/spec/Plates.tsx` for an `<Image>` carrying the global `.shot`
   class (`app/globals.css`) — that applies `grayscale(1) brightness(.85) contrast(1.6)`.
3. if `.shot` is not aggressive enough, escalate to the true halftone:
   `filter: grayscale(1) brightness(.8) blur(3px) contrast(999)` on the image plus
   a `::after` radial-gradient dot matrix at `mix-blend-mode: screen`.
   Reference: https://leanrada.com/notes/pure-css-halftone/

## Known gaps

- `npm run lint` is broken and was before this work — Next 16 removed `next lint`
  and the repo has no `eslint.config.js`. Either add a flat config or drop the script.
- The `log` section is the most fabricated thing on these pages. If real version
  history does not exist, deleting `Log.tsx` is the honest move.
