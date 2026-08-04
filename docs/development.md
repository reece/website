# Development

## Stack

Nuxt 4 website with content-driven pages, custom Vue components under `app/`, and Vitest coverage for UI primitives. Package manager: `pnpm` (`pnpm-lock.yaml` is committed).

## Local workflow

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build production output: `pnpm build`
- Generate static site: `pnpm generate`
- Preview build: `pnpm preview`
- Run tests: `pnpm test`
- Watch tests: `pnpm test:watch`

## Repository layout

- `app/`: Nuxt app source, including pages, layouts, and shared components.
- `app/components/ink/`: globally auto-registered decorative components.
- `app/assets/`: static styling assets such as CSS, brush textures, and images.
- `content/`: markdown content managed by `@nuxt/content`.
- `tests/`: Vitest specs for components and CSS-backed behaviors.
- `docs/superpowers/`: internal design specs and implementation plans; use for context, not as executable source.
- `.github/workflows/`: CI, currently deploy-to-GitHub-Pages only (no test/lint gate — run `pnpm test` locally before merging).

## Working rules

- Prefer surgical edits; do not refactor unrelated areas.
- Do not add new dependencies unless they are necessary for the requested task.
- Match existing Vue/Nuxt patterns: `<script setup lang="ts">`, existing utility-class conventions, and current naming.
- Treat decorative visuals as non-interactive unless requirements say otherwise; preserve accessibility attributes already used in similar components.
- For content changes, keep frontmatter consistent with `content.config.ts`.
- For UI changes, inspect related pages/components and existing tests in `tests/` before editing.
- For styling changes, reuse existing design tokens and CSS utilities before inventing new patterns.

## Validation expectations

- Run the smallest relevant existing test command after edits; for most component or styling changes, start with `pnpm test` or a targeted Vitest file.
- If changing build-affecting Nuxt config or content behavior, run the relevant existing build command as well.
- When adding or changing component behavior, add or update Vitest coverage near the corresponding spec file.
- Do not introduce secrets or environment-specific values into tracked files.
