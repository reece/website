# AGENTS.md

## Overview
- This repository is a Nuxt 4 website with content-driven pages, custom Vue components under `app/`, and Vitest coverage for UI primitives.
- Package manager: `pnpm` (`pnpm-lock.yaml` is committed). Runtime and test scripts are defined in `/home/runner/work/website/website/package.json`.
- Keep changes small and aligned with the existing parchment/ink visual language used across the site.

## Repository layout
- `app/`: Nuxt app source, including pages, layouts, and shared components.
- `app/components/ink/`: globally auto-registered decorative components.
- `app/assets/`: static styling assets such as CSS, brush textures, and images.
- `content/`: markdown content managed by `@nuxt/content`.
- `tests/`: Vitest specs for components and CSS-backed behaviors.
- `docs/superpowers/`: internal design specs and implementation plans; use for context, not as executable source.

## Working rules
- Use absolute paths when referencing repository files.
- Prefer surgical edits; do not refactor unrelated areas.
- Do not add new dependencies unless they are necessary for the requested task.
- Match existing Vue/Nuxt patterns: `<script setup lang="ts">`, existing utility-class conventions, and current naming.
- Treat decorative visuals as non-interactive unless requirements say otherwise; preserve accessibility attributes already used in similar components.
- Avoid creating extra planning markdown files unless explicitly requested.

## Local workflow
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build production output: `pnpm build`
- Generate static site: `pnpm generate`
- Preview build: `pnpm preview`
- Run tests: `pnpm test`
- Watch tests: `pnpm test:watch`

## Change guidance
- For content changes, keep frontmatter consistent with `/home/runner/work/website/website/content.config.ts`.
- For UI changes, inspect related pages/components and existing tests in `/home/runner/work/website/website/tests` before editing.
- When adding or changing component behavior, add or update Vitest coverage near the corresponding spec file.
- For styling changes, reuse existing design tokens and CSS utilities before inventing new patterns.

## Validation expectations
- Run the smallest relevant existing test command after edits; for most component or styling changes, start with `pnpm test` or a targeted Vitest file.
- If changing build-affecting Nuxt config or content behavior, run the relevant existing build command as well.
- Do not introduce secrets or environment-specific values into tracked files.

## Notes for future agents
- There is no repository README at the root today, so rely on source structure, `package.json`, and `docs/superpowers/` for project context.
- `.github/` currently contains workflows only; check workflow definitions there if CI behavior is relevant.
