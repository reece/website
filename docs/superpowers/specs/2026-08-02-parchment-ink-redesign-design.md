# Parchment & Ink redesign

Full visual redesign of reecehart.com, replacing the current generic Tailwind/neutral-gray theme with a custom "flow and ease" aesthetic: parchment background, hand-drawn ink accents, painted brush-stroke bands, and an architect-style serif for headings.

**Reference mockup:** [../plans/2026-08-02-parchment-ink-redesign-mockup.png](../plans/2026-08-02-parchment-ink-redesign-mockup.png) — the original hand-sketched design driving every decision below.

## Goals

- Replace the generic starter look with a distinctive design system driven by a hand-sketched mockup (paint-stroke header/footer bands, hand-drawn dividers, architect's-type headings, soft parchment/slate/forest palette).
- Apply the system across all real pages: Home, About (absorbing Contact), Writing/blog index, and blog post template.
- Ship a `/visual-language` reference page first, both as living documentation and as the first real test of every component in the system.
- Leave dark mode exactly as it is today (existing `dark:neutral-*` Tailwind classes) — this redesign only replaces the light theme.
- Placeholder all real illustrations (bridge sketch, Venn diagram, whiteboard photos) with a generic abstract sketch-style filler; swap for real art later.

## Non-goals

- No dark-mode redesign — current dark classes are untouched.
- No real illustration assets — `SketchPlaceholder` stands in everywhere a real drawing/photo is implied by the mock.
- No changes to `@nuxt/content` schema (blog tags stay freeform/optional; the Writing page's category filter is derived from whatever tags exist in content, not a fixed enum).
- No standalone Contact page — folded into About.

## Palette

CSS custom properties (light theme only):

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FAF8F5` | Page background (parchment) |
| `--tan` | `#E7E2DB` | Secondary surface, callout backgrounds |
| `--ink` | `#52504A` | Primary text ("soft charcoal" — softened from mock's near-black per live comparison) |
| `--slate` | `#365C7A` | Links, primary brush-stroke color |
| `--forest` | `#6A7C6E` | Secondary accent |

## Typography

- Headings: **Source Serif 4** ("architect's type" feel — thoughtful, readable, timeless per the mock's own style panel)
- Body: **Inter**
- Loaded via `@nuxt/fonts` (new dependency — approved by user during brainstorming, self-hosts Google Fonts automatically, avoids layout shift)

## Signature line components

Four components, matching the mock's "Visual Language" panel 1:1 (each has one job; no shared multi-variant mega-component):

1. **`BrushStroke.vue`** — wide painterly band for page header/footer sections and major dividers.
   - Technique (locked via interactive SVG comparison): a wide asymmetric wave path, distorted via `feTurbulence` (`baseFrequency` skewed toward long horizontal streaks — low X frequency, high Y frequency — for a dry-brush fiber look, not blobby noise) + `feDisplacementMap`, layered with a thin lighter-tone stroke overlay following the same path, plus a turbulent speckle mask overlay for grain.
   - Props: `color` (defaults to `--slate`), `flip` (boolean, for footer vs. header orientation).
2. **`ThinPenLine.vue`** — subtle horizontal separator, low visual weight, slightly irregular (hand-drawn) rule. Used between list items and minor section breaks.
3. **`PencilNote.vue`** — small scribble/squiggle annotation mark, used near callout boxes and margin notes for a "human touch."
4. **`MarkerUnderline.vue`** — wavy underline accent, used under links and highlighted headings (e.g. the underline beneath "About" in the mock's nav, or beneath post titles).

Plus one functional (non-decorative) component:

5. **`SketchPlaceholder.vue`** — generic abstract line-doodle in `--ink`, standing in for every real illustration/whiteboard-photo slot in the mock (Golden Gate sketch, Venn diagram, per-post diagrams) until real art is supplied.

## Texture

Paper-grain background textures (the mock's "Textures" row), generated the same way as the brush strokes — SVG `feTurbulence` tiles, rendered once and reused as low-opacity repeating CSS background utility classes (e.g. `.texture-paper`). Applied sparingly, per the mock's own caption ("use texture sparingly to add warmth and depth") — not a default background on every surface.

## Pages

Build order (style guide first, so every component has a live reference before it's used elsewhere):

1. **`/visual-language`** (new page) — renders every palette swatch, both fonts, all 4 line components, the placeholder sketch, and texture samples, live. Unlinked from nav/footer — reachable only by direct URL, since it's a dev/design reference rather than user-facing content.
2. **Home** (`app/pages/index.vue`, replacing the current bare version — `index2.vue` was the prior placeholder and can be deleted once this ships) — hero section with a `BrushStroke` header band, tagline, and a "Recent thoughts" list separated by `ThinPenLine`.
3. **About** (`app/pages/about.vue`) — existing bio content, plus a "What I do" section (build / understand / collaborate, matching the mock), a `SketchPlaceholder` for the Venn-style diagram, and a folded-in contact section (email + GitHub links, replacing the standalone Contact page).
4. **Writing / blog index** (`app/pages/blog/index.vue`) — tag-pill filter row computed from the distinct tags present across posts (no schema change), post list separated by `ThinPenLine`.
5. **Blog post** (`app/pages/blog/[slug].vue`) — `MarkerUnderline` under the title, on-page TOC sidebar (derived from post headings), `PencilNote`-styled callout boxes for blockquotes.

**Removed**: `app/pages/contact.vue` and its `AppNav` link. `app/pages/index2.vue` removed once the new Home ships.

## Nav & layout

- `AppNav.vue`: drop the plain border-bottom, replace with a `BrushStroke` accent; active/hover link states use `MarkerUnderline` instead of color-only change.
- `default.vue`: same treatment for the footer border; dark-mode classes (`dark:bg-neutral-950` etc.) stay as-is — the new palette is additive for light mode only.

## Responsive / mobile

Mobile is a first-class target, not a reflow afterthought — every component and page layout is designed mobile-first and checked at a narrow viewport as it's built, not patched in after.

- **`BrushStroke`**: SVG `viewBox` scales fluidly by nature (width 100%, height fixed or `vh`-capped); verify the turbulence/displacement distortion still reads as a brush texture at narrow widths rather than smearing into mush. Reduce band height on small screens (e.g. `h-16` mobile → `h-24` desktop) rather than keeping a fixed px height.
- **`AppNav`**: current desktop nav (logo left, links + dark-mode toggle right) collapses to a mobile pattern — hamburger/slide-out or a simple wrapped/stacked link row, whichever reads cleaner once built; decide by looking at it live rather than guessing now.
- **Home**: hero text and brush band stack fine by default (single column); recent-thoughts list already stacks vertically.
- **About**: the 3-column "What I do" (build / understand / collaborate) becomes a single column on mobile; the Venn-style `SketchPlaceholder` scales down or stacks above/below body text rather than sitting inline beside it.
- **Writing / blog index**: tag-pill filter row becomes horizontally scrollable (not wrapped into a multi-row block) on narrow screens, to avoid pushing post list content down.
- **Blog post**: the "On this page" TOC sidebar (desktop: fixed left column) drops below the article or becomes a collapsible/disclosure block on mobile — it does not squeeze into a narrow side column.
- **Visual-language page**: swatch/component grids reflow to fewer columns (1–2) on mobile; this page is a reference tool, so correctness matters more than density here.

Verification: check every shipped page at a mobile viewport width (e.g. 375px) as it's built, not just at the end.

## Testing / verification

- No dark mode regression: spot-check dark mode still renders (unchanged classes) after the light-theme rework.
- Visit `/visual-language` first and confirm every component renders correctly before wiring it into real pages.
- Confirm Writing page tag filter behaves correctly with only one real post (`hello-world.md`) — i.e., doesn't break with a sparse/single-tag dataset.
