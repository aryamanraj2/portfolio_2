# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000). `next.config.mjs` whitelists a LAN dev origin under `allowedDevOrigins`; add your machine's IP there when accessing the dev server from another device.
- `npm run build` — production build.
- `npm start` — serve the production build.
- `npm run lint` — **broken**. Next 16 removed `next lint` and there is no `eslint.config.js`. Use `npx tsc --noEmit`; the build runs its own TypeScript pass too.

There is no test setup yet.

## Architecture

Next.js 16 App Router with React 19, TypeScript (`strict`), and no CSS/UI framework — styling is hand-written CSS.

- `app/layout.tsx` — root layout. Loads the Satoshi **variable** font from Fontshare via `<link>` (not `next/font`); the `@1` in the query string is what makes `font-variation-settings` work. Sets metadata and the `#000000` theme color.
- `app/globals.css` — global reset plus the design tokens everything keys off: `--ink` (#000000, background), `--bone` (#fffff0, foreground), `--mono` (system mono stack), `--ease-soft` (the shared easing curve). Also the global utilities `.srOnly`, `.halftone`, `.shot`. `body` has `overflow: hidden`; each route supplies its own fixed, scrollable root.
- `app/page.tsx` — server component; fetches the music rotation and renders `Shell`, which gates the page behind the `Loader`.
- `app/components/` — components paired with CSS Modules (e.g. `Loader.tsx` + `Loader.module.css`). This is the convention for new components.
- `app/lib/apps.ts` — the single source of truth for the three projects. `Projects.tsx`, `site.ts`, `sitemap.ts` and the `/apps/[slug]` route all read from `APPS`. Most spec values are placeholders; see `TODO.md`.

### Routes

`/` (homepage) · `/resume` (PDF viewer) · `/apps/[slug]` (per-app spec sheet, three static pages). Each route owns its own `opengraph-image.tsx` and injects JSON-LD from `app/lib/site.ts`.

### App spec pages

`app/apps/[slug]/` plus `app/components/spec/`. Lean-brutalist: radius 0, 1px hairlines as the only separator, mono for every numeral with `tabular-nums`, ISO dates, three casing registers (lowercase default, ALL CAPS for assertions, mono for numbers). Emphasis comes from weight, scale and whitespace — never opacity, never glow.

Every spec component styles against `--bg` / `--fg` / `--hot` / `--hot-ink` / `--rule`, never against `--ink`/`--bone` directly. The page root sets `--hot` and `--hot-ink` inline from the app's data, so one wrapper flips every descendant. `--hot-ink` exists because AquaSense's accent is dark (`--aqua-dark`) while the other two are light — filled elements need a text colour that follows.

`--soft` and `html[data-tint]` are homepage machinery driven by `Wash`; the app pages do not touch them.

### Loader

`app/components/Loader.tsx` is the intro animation: a 0→100% counter (`requestAnimationFrame`, ease-out cubic over `DURATION`) alongside cycling multilingual greetings. It always leads with "Hello" then shuffles the Indian-script greetings (`REST`) client-side after mount — the initial render uses the deterministic unshuffled order to stay SSR-safe (avoid hydration mismatches when editing this). When the counter completes it triggers a leave transition and then calls `onDone`.

## Conventions

- `@/*` path alias maps to the project root (see `tsconfig.json`).
- Reference design tokens via the CSS variables in `globals.css` rather than hardcoding colors/easing.
- Components that use hooks or browser APIs need the `"use client"` directive (App Router defaults to Server Components).

# keep no comments in this whole project!!!!!!!