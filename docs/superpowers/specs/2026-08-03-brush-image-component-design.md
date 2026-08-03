# Raster brush strokes via CSS mask

Add a new component to generate brush decorations using real bristle-texture raster art (`brush1.webp`–`brush4.webp`, currently sitting at repo root), recolorable at will via CSS. These are in addition to the existing SVG components.

## Goals

- Bring the four supplied `brush{1,2,3,4}.webp` bristle-texture images into the asset pipeline and make them usable as themeable, recolorable UI elements.
- Support arbitrary CSS recoloring at render time (any of the palette tokens in `theme.css`/`uno.config.ts`, or any other CSS color) without pre-generating color variants of the images.
- Provide a generic component that any call site can point at one of the four images by name.
- Support flipping the art horizontally, vertically, or both, matching the orientation needs of header/footer placement (mirroring how `BrushStroke.vue`'s `flip` prop is used today in `default.vue`).

## Non-goals

- No replacement of `BrushStroke.vue` or `HeaderBrush.vue` — both keep their current SVG/`feTurbulence` rendering and existing call sites untouched. This is a new, additional component.
- No vectorization/tracing of the webp art into SVG paths.
- No random/rotating brush selection logic — the caller always specifies which image by name.
- No build-time generation of pre-colored image variants.
- No changes to `visual-language.vue` content/layout beyond whatever the follow-up implementation plan decides is needed to showcase the new component (left to the implementation plan, not specified here).

## Technique: CSS `mask-image`

All four source images are confirmed to have an alpha channel (solid bristle color, transparent background). CSS masking uses an image's alpha (or luminance) as a per-pixel stencil, independent of the source's own baked-in color — so a solid-navy webp works as a mask for *any* `background-color` without preprocessing.

Rendering shape: a content-free `<div>` whose visible fill comes from `background-color`, shaped by `mask-image`/`-webkit-mask-image` pointing at the webp:

```css
.brush-image {
  background-color: currentColor; /* overridden by the color prop */
  mask-image: var(--brush-url);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: var(--brush-url); /* Safari still requires the prefix */
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
}
```

Recoloring is then just changing `background-color` (via the `color` prop), the same mental model as `fill="var(--forest)"` on `BrushStroke`.

## Assets

Move `brush1.webp`, `brush2.webp`, `brush3.webp`, `brush4.webp` from the repo root into `app/assets/brushes/`, matching the existing `app/assets/{css,images}/` layout.

Resolve `name` → URL via Vite's glob import (`import.meta.glob('~/assets/brushes/*.webp', { eager: true, query: '?url', import: 'default' })` or an equivalent explicit import map) rather than string-concatenating a path, so the build's asset hashing/fingerprinting applies correctly.

## Component: `BrushImage.vue`

New file: `app/components/ink/BrushImage.vue`, alongside `BrushStroke.vue`, `HeaderBrush.vue`, `InkRule.vue`.

**Props:**

```ts
{
  name: string          // basename, e.g. "brush1" — required, no default
  color?: string         // default 'currentColor' (matches BrushStroke's var(--slate)-style usage)
  flip?: 'none' | 'horizontal' | 'vertical' | 'both'  // default 'none'
}
```

`flip` maps to a CSS transform:

| `flip` value | transform |
|---|---|
| `none` | (none) |
| `horizontal` | `scaleX(-1)` |
| `vertical` | `scaleY(-1)` |
| `both` | `scale(-1, -1)` |

**Sizing:** wrapper sizing follows `BrushStroke`'s convention (`w-full h-16 md:h-24`), since this is a drop-in visual alternative for the same slot (section breaks, header/footer accents) — exact classes to be finalized in the implementation plan based on each source image's native aspect ratio (they differ: brush1/2 are ~8.3:1, brush3/4 are ~14–22:1).

**Accessibility:** matches existing decorative-brush convention — `role="presentation" aria-hidden="true"` on the wrapper (see `BrushStroke.vue`, `HeaderBrush.vue`).

## Testing

Follow existing test conventions (`tests/components/ink/BrushStroke.spec.ts`, `tests/components/ink/HeaderBrush.spec.ts`) — a `BrushImage.spec.ts` covering: renders for each valid `name`, applies `color` as the mask fill, applies the correct transform per `flip` value, and carries the `aria-hidden`/`role="presentation"` decorative markup.

## Open questions for the implementation plan

- Exact Tailwind/UnoCSS height utility per brush image (native aspect ratios vary significantly across the four files).
- Whether/how `visual-language.vue`'s "Brush Strokes" section is updated to demonstrate `BrushImage` alongside the existing `BrushStroke` examples.
