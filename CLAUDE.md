# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000). `next.config.mjs` whitelists a LAN dev origin under `allowedDevOrigins`; add your machine's IP there when accessing the dev server from another device.
- `npm run build` — production build.
- `npm start` — serve the production build.
- `npm run lint` — Next.js ESLint.

There is no test setup yet.

## Architecture

Next.js 16 App Router with React 19, TypeScript (`strict`), and no CSS/UI framework — styling is hand-written CSS. This is an early-stage personal portfolio; `app/page.tsx` is currently a placeholder that the real sections will replace.

- `app/layout.tsx` — root layout. Loads the Satoshi font from Fontshare via `<link>` (not `next/font`), sets metadata and the `#10100e` theme color.
- `app/globals.css` — global reset plus the design tokens that everything keys off: `--ink` (#10100e, background), `--bone` (#ffffe3, foreground), `--ease-soft` (the shared easing curve). `body` has `overflow: hidden` — the intended experience is a single non-scrolling viewport per section.
- `app/page.tsx` — client component that gates the page behind the `Loader` (fades content in once `onDone` fires).
- `app/components/` — components paired with CSS Modules (e.g. `Loader.tsx` + `Loader.module.css`). This is the convention for new components.

### Loader

`app/components/Loader.tsx` is the intro animation: a 0→100% counter (`requestAnimationFrame`, ease-out cubic over `DURATION`) alongside cycling multilingual greetings. It always leads with "Hello" then shuffles the Indian-script greetings (`REST`) client-side after mount — the initial render uses the deterministic unshuffled order to stay SSR-safe (avoid hydration mismatches when editing this). When the counter completes it triggers a leave transition and then calls `onDone`.

## Conventions

- `@/*` path alias maps to the project root (see `tsconfig.json`).
- Reference design tokens via the CSS variables in `globals.css` rather than hardcoding colors/easing.
- Components that use hooks or browser APIs need the `"use client"` directive (App Router defaults to Server Components).

# keep no comments in this whole project!!!!!!!