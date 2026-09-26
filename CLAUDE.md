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
- `HomeComponent` handles its own cookie-consent banner (localStorage key `cookie-consent`), `IntersectionObserver`-driven reveals (`.reveal` → `.in-view`, run via `NgZone.runOutsideAngular`) and the project film (`video[data-autoplay]`: plays muted while on screen, pauses off it, never resumes a viewer's own pause).
- Content is project-first and short (2026-09, for AI-engineer roles): hero (portrait, name, one line, two buttons), a `proof` strip with one number per project, the `projects` grid (each card: one visual, a tag naming the skill it proves, name, one line, a link), a short About (`facts`) and contact. The résumé itself is deliberately not repeated. A project is listed only if it proves something the others don't; private repos are never linked.
- `hasCv` stays `false` until the PDF exists in `public/assets/`; the portrait is `public/assets/images/portrait.webp`.
- Change detection uses zone.js with `provideZoneChangeDetection({ eventCoalescing: true })`.

### Conventions

- The component selector is `home-component` (not the `app` prefix configured in `angular.json`).
- Strict TypeScript + strict Angular templates are on (`strictTemplates`, `noPropertyAccessFromIndexSignature`, etc.). Style language is SCSS.
- `.editorconfig`: 2-space indent, single quotes in `.ts`, final newline. Prettier formats `.html` with the Angular parser.
- Static assets (images, favicon) live in `Projects/public/` and are copied to the build root; reference them as `assets/...` in code.

### Design (2026-09, "studio dark")

Ground `#141517` is the portrait's own background, so the photo's masked edges melt into the page; surfaces `#1b1c1f` / `#232427`, hairlines `#2b2c30`, text `#f2f0eb` / `#b3b0a8` / `#8a877f`, one warm accent `#f4a261`, live green `#5fd08f`. The contact block flips to light (`#f2f0eb`). Type: Archivo (condensed via `font-stretch: 85%` for display) and JetBrains Mono for small tags. Project cards sit on an asymmetric 12-column grid (spans 8+4, then 5+7), never four identical boxes. The global ground lives in `src/styles.scss` because Angular scopes component styles: a `body` rule inside `home.scss` never matches.

### Build budget gotcha

`angular.json` enforces a per-component style budget: **warning at 30 kB, error at 40 kB**. `home.scss` is ~12 kB after the 2026-09 redesign, so there is room, but the **production build fails past 40 kB** (this has broken Netlify prod builds before).

## Deployment

Hosted on Netlify (`netlify.toml`): builds with `npx ng build --configuration production` from `Projects/`, publishes `dist/Projects/browser`, with a SPA fallback redirect (`/*` → `/index.html`).
