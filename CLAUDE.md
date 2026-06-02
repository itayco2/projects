# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The git repo root is `Desktop\projects`, but the Angular application lives in the **`Projects/`** subdirectory. All `npm`/`ng` commands below must be run from `Projects/` (this is also why `netlify.toml` sets `base = "Projects"`).

## Commands

Run from `Projects/`:

- `npm start` — dev server with `--open` (http://localhost:4200)
- `npm run build` — production build (default config) → `dist/Projects/browser`
- `npm run watch` — development build, rebuilds on change
- `npm test` — Karma + Jasmine unit tests (Chrome launcher)
- `ng test --include='**/some.spec.ts'` — run a single spec file

Note: schematics are configured with `skipTests: true`, so there are currently **no `.spec.ts` files** — `npm test` runs an empty suite until specs are added.

## Architecture

This is an **Angular 20 standalone single-page portfolio site**. Despite the Angular scaffolding, it is effectively one screen:

- `src/main.ts` bootstraps **`HomeComponent` directly** (not an `AppComponent` shell with `<router-outlet>`). The router in `app.routes.ts`/`app.config.ts` is configured (redirect `""` → `/home`) but vestigial — adding real navigation requires bootstrapping a root component with a router outlet instead of `HomeComponent`.
- All page content and behavior lives in `src/app/components/page/home/` (`home.ts`, `home.html`, `home.scss`). The portfolio's project list is hard-coded as the `projects: Project[]` array inside `home.ts` — edit that array to change displayed work, not any external data file.
- `HomeComponent` handles its own scroll state, cookie-consent banner (localStorage key `cookie-consent`), `IntersectionObserver`-driven card reveals (run via `NgZone.runOutsideAngular` to avoid change-detection churn), and pointer-tracked card hover effects via CSS custom props (`--mx`/`--my`).
- Change detection uses zone.js with `provideZoneChangeDetection({ eventCoalescing: true })`.

### Conventions

- The component selector is `home-component` (not the `app` prefix configured in `angular.json`).
- Strict TypeScript + strict Angular templates are on (`strictTemplates`, `noPropertyAccessFromIndexSignature`, etc.). Style language is SCSS.
- `.editorconfig`: 2-space indent, single quotes in `.ts`, final newline. Prettier formats `.html` with the Angular parser.
- Static assets (images, favicon) live in `Projects/public/` and are copied to the build root; reference them as `assets/...` in code.

### Build budget gotcha

`angular.json` enforces a per-component style budget: **warning at 30 kB, error at 40 kB**. `home.scss` is already ~28 kB, so the **production build will fail if it grows past 40 kB**. Keep an eye on its size when adding styles (this constraint has already broken Netlify prod builds before).

## Deployment

Hosted on Netlify (`netlify.toml`): builds with `npx ng build --configuration production` from `Projects/`, publishes `dist/Projects/browser`, with a SPA fallback redirect (`/*` → `/index.html`).
