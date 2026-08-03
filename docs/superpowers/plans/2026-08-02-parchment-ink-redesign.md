# Parchment & Ink Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace reecehart.com's generic Tailwind/UnoCSS starter look with a custom "parchment & ink" design system (paint-stroke bands, hand-drawn line accents, Source Serif 4 / Inter typography, soft parchment/slate/forest palette), applied across Home, About, Writing/blog index, and blog post pages, plus a `/visual-language` reference page — fully responsive from the start.

**Architecture:** A small shared design-system layer (CSS custom properties + UnoCSS theme extension + 5 presentational Vue components) gets built and unit-tested first, verified live on a dedicated `/visual-language` page, then applied page by page. Dark mode is untouched throughout — the new palette only affects the light theme.

**Tech Stack:** Nuxt 4, UnoCSS (`presetWind3`), `@nuxt/fonts` (new), Vitest + `@vue/test-utils` + `happy-dom` + `@vitejs/plugin-vue` (new, dev-only), `@nuxt/content` (existing, unchanged schema).

## Global Constraints

- Dark mode: existing `dark:*` Tailwind/UnoCSS classes in `AppNav.vue` and `default.vue` are preserved as-is — no new dark-mode-specific variants are introduced for new components unless explicitly stated in a task.
- Palette tokens (exact hex): `--paper: #FAF8F5`, `--tan: #E7E2DB`, `--ink: #52504A`, `--slate: #365C7A`, `--forest: #6A7C6E`.
- Fonts: **Source Serif 4** for headings (`font-display` utility), **Inter** for body (`font-body` utility), via `@nuxt/fonts` with `provider: 'google'`.
- No changes to `@nuxt/content` schema — the blog collection's `tags` field stays `z.array(z.string()).optional()`.
- Every component follows the spacing-ownership rule: a component lays out only within its own box; it never uses negative margins to overlap siblings. Spacing between components is the parent page's responsibility.
- Every new `.vue` component uses `<script setup lang="ts">`.
- Mobile is checked per-task, not deferred: every page/component task's manual-verification step includes a check at 375px width in addition to desktop width.
- Standalone `app/pages/contact.vue` is removed; its content (email + GitHub links) is folded into `app/pages/about.vue`.
- `app/pages/index2.vue` is removed once the new `index.vue` ships.

---

## File Structure

**New files:**
- `app/assets/css/theme.css` — CSS custom properties for the palette.
- `app/components/ink/BrushStroke.vue` — painterly SVG band (header/footer/major dividers).
- `app/components/ink/ThinPenLine.vue` — subtle hand-drawn horizontal rule.
- `app/components/ink/PencilNote.vue` — scribble annotation mark.
- `app/components/ink/MarkerUnderline.vue` — wavy underline accent.
- `app/components/ink/SketchPlaceholder.vue` — generic abstract line-doodle illustration filler.
- `app/pages/visual-language.vue` — unlinked style-guide/reference page.
- `app/pages/index.vue` — new Home page (currently empty; `index2.vue` holds the old placeholder).
- `tests/components/ink/BrushStroke.spec.ts`, `ThinPenLine.spec.ts`, `PencilNote.spec.ts`, `MarkerUnderline.spec.ts`, `SketchPlaceholder.spec.ts` — component smoke tests.
- `vitest.config.ts` — isolated SFC test config.

**Modified files:**
- `package.json` — add `@nuxt/fonts` (dependency); `vitest`, `@vue/test-utils`, `happy-dom`, `@vitejs/plugin-vue` (devDependencies); `test` script.
- `nuxt.config.ts` — register `@nuxt/fonts` module, add `app/assets/css/theme.css` to `css` array.
- `uno.config.ts` — add `theme.colors` and `theme.fontFamily`.
- `app/components/AppNav.vue` — replace border-bottom with `BrushStroke`, drop Contact link, `MarkerUnderline` on active/hover.
- `app/layouts/default.vue` — replace footer border with `BrushStroke`, apply palette classes.
- `app/pages/about.vue` — add "What I do" section, `SketchPlaceholder`, folded-in contact section.
- `app/pages/blog/index.vue` — tag-pill filter row, `ThinPenLine` separators.
- `app/pages/blog/[slug].vue` — `MarkerUnderline` title, TOC sidebar (collapsible on mobile), `PencilNote` callout styling.

**Removed files:**
- `app/pages/contact.vue`
- `app/pages/index2.vue` (removed in the Home task, once its content is superseded)

---

## Task 1: Test tooling + design-system foundation (palette, fonts)

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `nuxt.config.ts`
- Modify: `uno.config.ts`
- Create: `app/assets/css/theme.css`

**Interfaces:**
- Produces: CSS custom properties `--paper`, `--tan`, `--ink`, `--slate`, `--forest` (usable via `var(--x)` anywhere, and via UnoCSS utilities `bg-paper`, `text-ink`, `bg-tan`, `text-slate`, `text-forest`, etc.).
- Produces: UnoCSS font utilities `font-display` (Source Serif 4) and `font-body` (Inter).
- Produces: `npm run test` (Vitest, run-once) and `npm run test:watch` scripts.

- [ ] **Step 1: Add test dependencies**

```bash
pnpm add -D vitest @vue/test-utils happy-dom @vitejs/plugin-vue
```

- [ ] **Step 2: Add `@nuxt/fonts` dependency**

```bash
pnpm add @nuxt/fonts
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
  },
})
```

- [ ] **Step 4: Add test scripts to `package.json`**

Add to the `scripts` block:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a throwaway smoke test to verify the harness works**

Create `tests/components/ink/_harness.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

describe('vitest harness', () => {
  it('mounts a trivial component', () => {
    const wrapper = mount({ template: '<div>ok</div>' })
    expect(wrapper.text()).toBe('ok')
  })
})
```

- [ ] **Step 6: Run the harness test and verify it passes, then delete it**

Run: `pnpm test`
Expected: 1 passed. Then delete `tests/components/ink/_harness.spec.ts` — it was only to prove the config works, not a real test.

- [ ] **Step 7: Register `@nuxt/fonts` in `nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',

  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/theme.css',
  ],
})
```

- [ ] **Step 8: Create `app/assets/css/theme.css` with palette custom properties**

```css
:root {
  --paper: #FAF8F5;
  --tan: #E7E2DB;
  --ink: #52504A;
  --slate: #365C7A;
  --forest: #6A7C6E;
}
```

- [ ] **Step 9: Add theme colors and fonts to `uno.config.ts`**

```ts
import { defineConfig, presetIcons, presetTypography, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  theme: {
    colors: {
      paper: 'var(--paper)',
      tan: 'var(--tan)',
      ink: 'var(--ink)',
      slate: 'var(--slate)',
      forest: 'var(--forest)',
    },
    fontFamily: {
      display: '"Source Serif 4", Georgia, serif',
      body: '"Inter", system-ui, sans-serif',
    },
  },
  shortcuts: {
    'link': 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors',
    'prose-container': 'prose prose-neutral dark:prose-invert max-w-none',
  },
})
```

- [ ] **Step 10: Manually verify fonts and colors load**

Run: `pnpm dev`, open the dev server URL. Add a temporary `<div class="font-display text-slate">test</div>` to `app/app.vue`, confirm in the browser dev tools that Source Serif 4 loads (Network tab, or Computed styles show the font) and the text renders in slate blue. Remove the temporary div afterward.

- [ ] **Step 11: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts nuxt.config.ts uno.config.ts app/assets/css/theme.css
git commit -m "feat: add design-system foundation (palette, fonts, test harness)"
```

---

## Task 2: `BrushStroke` component

**Files:**
- Create: `app/components/ink/BrushStroke.vue`
- Test: `tests/components/ink/BrushStroke.spec.ts`

**Interfaces:**
- Produces: `BrushStroke` component, props `{ color?: string; flip?: boolean }` (`color` defaults to `'var(--slate)'`; `flip` defaults to `false` — when `true`, the SVG is mirrored vertically for footer use via a `scaleY(-1)` transform, so a single path definition serves both header and footer orientations).
- Root element renders with `role="presentation"` and `aria-hidden="true"` (decorative only).

- [ ] **Step 1: Write the failing test**

```ts
// tests/components/ink/BrushStroke.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BrushStroke from '../../../app/components/ink/BrushStroke.vue'

describe('brushStroke', () => {
  it('renders an svg marked as decorative', () => {
    const wrapper = mount(BrushStroke)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop to the fill', () => {
    const wrapper = mount(BrushStroke, { props: { color: '#6A7C6E' } })
    expect(wrapper.find('path').attributes('fill')).toBe('#6A7C6E')
  })

  it('applies a vertical flip transform when flip is true', () => {
    const wrapper = mount(BrushStroke, { props: { flip: true } })
    expect(wrapper.attributes('style')).toContain('scaleY(-1)')
  })

  it('does not flip by default', () => {
    const wrapper = mount(BrushStroke)
    expect(wrapper.attributes('style') ?? '').not.toContain('scaleY(-1)')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/components/ink/BrushStroke.spec.ts`
Expected: FAIL — cannot find module `../../../app/components/ink/BrushStroke.vue`.

- [ ] **Step 3: Implement `BrushStroke.vue`**

This uses the locked recipe from the design spec: a wide asymmetric wave path, distorted via `feTurbulence` (stretched — low X frequency, high Y frequency — for dry-brush fiber, not blobby noise) + `feDisplacementMap`, plus a thin lighter stroke overlay, plus a speckle mask overlay.

```vue
<template>
  <div
    role="presentation"
    aria-hidden="true"
    class="w-full h-16 md:h-24"
    :style="flip ? 'transform: scaleY(-1)' : undefined"
  >
    <svg viewBox="0 0 800 100" preserveAspectRatio="none" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="roughId" x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.4" numOctaves="3" :seed="seed" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter :id="speckleId" x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.25 1.1" numOctaves="2" :seed="seed + 1" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 -0.35" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
      </defs>
      <path
        d="M0,25 C 100,8 250,42 400,20 C 550,-2 650,35 800,15 L800,58 C 650,80 550,42 400,65 C 250,85 100,52 0,70 Z"
        :fill="color"
        :filter="`url(#${roughId})`"
      />
      <path
        d="M20,30 C 120,15 260,45 410,26 C 560,6 660,38 780,20"
        :stroke="color"
        stroke-width="6"
        fill="none"
        opacity="0.5"
        :filter="`url(#${roughId})`"
      />
      <path
        d="M0,25 C 100,8 250,42 400,20 C 550,-2 650,35 800,15 L800,58 C 650,80 550,42 400,65 C 250,85 100,52 0,70 Z"
        fill="var(--ink)"
        opacity="0.45"
        :filter="`url(#${speckleId})`"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: string
  flip?: boolean
}>(), {
  color: 'var(--slate)',
  flip: false,
})

const instanceId = useId()
const roughId = `brush-rough-${instanceId}`
const speckleId = `brush-speckle-${instanceId}`
const seed = 7
</script>
```

Note: `useId()` is Vue 3.5+'s built-in composable for stable, SSR-safe unique IDs — required here because SVG `filter` IDs must be unique per instance when multiple `BrushStroke`s render on one page (e.g. header + footer), otherwise `<filter id="...">` collisions cause all instances to reuse the first one's filter.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/components/ink/BrushStroke.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Manually verify in isolation**

Temporarily add `<BrushStroke />` and `<BrushStroke flip color="var(--forest)" />` to `app/app.vue`, run `pnpm dev`, confirm both render as a ragged painterly band (not a smooth blob) at both desktop and 375px mobile width, and the flipped one is mirrored. Remove the temporary usage afterward.

- [ ] **Step 6: Commit**

```bash
git add app/components/ink/BrushStroke.vue tests/components/ink/BrushStroke.spec.ts
git commit -m "feat: add BrushStroke component"
```

---

## Task 3: `ThinPenLine`, `MarkerUnderline`, `PencilNote` components

**Files:**
- Create: `app/components/ink/ThinPenLine.vue`
- Create: `app/components/ink/MarkerUnderline.vue`
- Create: `app/components/ink/PencilNote.vue`
- Test: `tests/components/ink/ThinPenLine.spec.ts`
- Test: `tests/components/ink/MarkerUnderline.spec.ts`
- Test: `tests/components/ink/PencilNote.spec.ts`

**Interfaces:**
- Produces: `ThinPenLine` component, no required props, optional `color?: string` (defaults `'var(--ink)'`). Renders a full-width low-weight horizontal rule.
- Produces: `MarkerUnderline` component, no required props, optional `color?: string` (defaults `'var(--slate)'`). Intended to wrap inline content via the default slot, rendering a wavy underline beneath it.
- Produces: `PencilNote` component, no required props, optional `color?: string` (defaults `'var(--ink)'`). Renders a small standalone scribble mark (not slotted — purely decorative, placed near a callout by the parent).

- [ ] **Step 1: Write the failing tests**

```ts
// tests/components/ink/ThinPenLine.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ThinPenLine from '../../../app/components/ink/ThinPenLine.vue'

describe('thinPenLine', () => {
  it('renders a decorative svg rule', () => {
    const wrapper = mount(ThinPenLine)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop', () => {
    const wrapper = mount(ThinPenLine, { props: { color: '#6A7C6E' } })
    expect(wrapper.find('path').attributes('stroke')).toBe('#6A7C6E')
  })
})
```

```ts
// tests/components/ink/MarkerUnderline.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkerUnderline from '../../../app/components/ink/MarkerUnderline.vue'

describe('markerUnderline', () => {
  it('renders slotted content', () => {
    const wrapper = mount(MarkerUnderline, {
      slots: { default: 'About' },
    })
    expect(wrapper.text()).toContain('About')
  })

  it('renders a decorative svg underline alongside the slot content', () => {
    const wrapper = mount(MarkerUnderline, { slots: { default: 'About' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies the color prop', () => {
    const wrapper = mount(MarkerUnderline, {
      props: { color: '#365C7A' },
      slots: { default: 'About' },
    })
    expect(wrapper.find('path').attributes('stroke')).toBe('#365C7A')
  })
})
```

```ts
// tests/components/ink/PencilNote.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PencilNote from '../../../app/components/ink/PencilNote.vue'

describe('pencilNote', () => {
  it('renders a decorative svg scribble', () => {
    const wrapper = mount(PencilNote)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop', () => {
    const wrapper = mount(PencilNote, { props: { color: '#52504A' } })
    expect(wrapper.find('path').attributes('stroke')).toBe('#52504A')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test tests/components/ink/ThinPenLine.spec.ts tests/components/ink/MarkerUnderline.spec.ts tests/components/ink/PencilNote.spec.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `ThinPenLine.vue`**

```vue
<template>
  <div role="presentation" aria-hidden="true" class="w-full h-3">
    <svg viewBox="0 0 800 12" preserveAspectRatio="none" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,6 C 100,3 200,9 300,5 C 400,2 500,8 600,5 C 700,3 750,7 800,5"
        :stroke="color"
        stroke-width="1.25"
        fill="none"
        opacity="0.5"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: 'var(--ink)',
})
</script>
```

- [ ] **Step 4: Implement `MarkerUnderline.vue`**

```vue
<template>
  <span class="relative inline-block">
    <slot />
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      class="absolute left-0 -bottom-1.5 w-full h-2.5 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,7 C 30,2 60,11 100,6 C 140,1 170,10 200,6"
        :stroke="color"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
        opacity="0.65"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: 'var(--slate)',
})
</script>
```

Note: the underline SVG is absolutely positioned *within* this component's own relatively-positioned root `<span>` — it does not reach outside its box with negative margins on the parent, keeping to the spacing-ownership rule; `-bottom-1.5` shifts the underline within the component's own layout space, not into a sibling's.

- [ ] **Step 5: Implement `PencilNote.vue`**

```vue
<template>
  <div role="presentation" aria-hidden="true" class="w-8 h-8">
    <svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4,20 C 8,14 6,8 12,10 C 18,12 14,20 20,18 C 24,16.5 22,22 28,20"
        :stroke="color"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        opacity="0.7"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: 'var(--ink)',
})
</script>
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm test tests/components/ink/ThinPenLine.spec.ts tests/components/ink/MarkerUnderline.spec.ts tests/components/ink/PencilNote.spec.ts`
Expected: PASS (7 tests total).

- [ ] **Step 7: Commit**

```bash
git add app/components/ink/ThinPenLine.vue app/components/ink/MarkerUnderline.vue app/components/ink/PencilNote.vue tests/components/ink/ThinPenLine.spec.ts tests/components/ink/MarkerUnderline.spec.ts tests/components/ink/PencilNote.spec.ts
git commit -m "feat: add ThinPenLine, MarkerUnderline, PencilNote components"
```

---

## Task 4: `SketchPlaceholder` component

**Files:**
- Create: `app/components/ink/SketchPlaceholder.vue`
- Test: `tests/components/ink/SketchPlaceholder.spec.ts`

**Interfaces:**
- Produces: `SketchPlaceholder` component, props `{ label?: string }` (optional visually-hidden caption for accessibility, e.g. `"Illustration: bridge sketch"` — since this is a *functional* filler standing in for real content, not purely decorative, it does not use `aria-hidden`).

- [ ] **Step 1: Write the failing test**

```ts
// tests/components/ink/SketchPlaceholder.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SketchPlaceholder from '../../../app/components/ink/SketchPlaceholder.vue'

describe('sketchPlaceholder', () => {
  it('renders an svg doodle', () => {
    const wrapper = mount(SketchPlaceholder)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('is not aria-hidden (it stands in for real content)', () => {
    const wrapper = mount(SketchPlaceholder)
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('renders a visually-hidden label when provided', () => {
    const wrapper = mount(SketchPlaceholder, { props: { label: 'Illustration: bridge sketch' } })
    expect(wrapper.text()).toContain('Illustration: bridge sketch')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/components/ink/SketchPlaceholder.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `SketchPlaceholder.vue`**

```vue
<template>
  <div class="w-full aspect-video flex items-center justify-center">
    <span v-if="label" class="sr-only">{{ label }}</span>
    <svg viewBox="0 0 200 120" class="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="55" r="30" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" />
      <circle cx="95" cy="70" r="26" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" />
      <path d="M20,100 L60,40 L100,95 L140,50 L180,100" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/components/ink/SketchPlaceholder.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/ink/SketchPlaceholder.vue tests/components/ink/SketchPlaceholder.spec.ts
git commit -m "feat: add SketchPlaceholder component"
```

---

## Task 5: `/visual-language` reference page

**Files:**
- Create: `app/pages/visual-language.vue`

**Interfaces:**
- Consumes: `BrushStroke`, `ThinPenLine`, `MarkerUnderline`, `PencilNote`, `SketchPlaceholder` (all from Tasks 2–4; Nuxt auto-imports components under `app/components/`, so no explicit import statements are needed — they're referenced directly in the template as `<BrushStroke />` etc.)

- [ ] **Step 1: Create the page**

```vue
<template>
  <div class="font-body text-ink">
    <BrushStroke color="var(--ink)" />

    <div class="max-w-3xl mx-auto px-6 py-10 space-y-12">
      <header>
        <h1 class="font-display text-3xl font-semibold">
          Visual Language
        </h1>
        <p class="mt-2 text-sm opacity-75">
          A few consistent elements create a feeling of flow, craft, and clarity.
        </p>
      </header>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Line marks</h2>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Thin pen line — for subtle separation</p>
            <ThinPenLine />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Brush stroke — for section breaks and emphasis</p>
            <BrushStroke />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Pencil note — for annotations and human touches</p>
            <PencilNote />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Marker underline — for links and highlights</p>
            <MarkerUnderline color="var(--slate)">
              <span class="font-display text-lg">Sample link text</span>
            </MarkerUnderline>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Color palette</h2>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="swatch in swatches"
            :key="swatch.name"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded flex items-end justify-center pb-1 text-xs"
            :style="{ background: swatch.value, color: swatch.textOn }"
          >
            {{ swatch.name }}
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Typography</h2>
        <p class="font-display text-3xl">Aa — Headings: Source Serif 4</p>
        <p class="font-body text-lg mt-2">Aa — Body: Inter</p>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Illustration placeholder</h2>
        <SketchPlaceholder label="Sample illustration placeholder" class="max-w-sm" />
      </section>
    </div>

    <BrushStroke color="var(--ink)" flip />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Visual Language · Reece Hart' })

const swatches = [
  { name: 'paper', value: 'var(--paper)', textOn: 'var(--ink)' },
  { name: 'tan', value: 'var(--tan)', textOn: 'var(--ink)' },
  { name: 'ink', value: 'var(--ink)', textOn: 'var(--paper)' },
  { name: 'slate', value: 'var(--slate)', textOn: 'var(--paper)' },
  { name: 'forest', value: 'var(--forest)', textOn: 'var(--paper)' },
]
</script>
```

This page intentionally has no `AppNav` link — it's reachable only by direct URL (`/visual-language`), per the design spec.

- [ ] **Step 2: Manually verify**

Run: `pnpm dev`, visit `/visual-language`. Confirm: both brush strokes render top and bottom (footer one visibly flipped), all 4 line marks display correctly, the 5 color swatches show the right hues with readable labels, both fonts render distinctly, the placeholder doodle displays. Check at 375px width — the swatch row should wrap to fewer per line, not overflow.

- [ ] **Step 3: Commit**

```bash
git add app/pages/visual-language.vue
git commit -m "feat: add /visual-language reference page"
```

---

## Task 6: Nav and layout — brush-stroke header/footer, drop Contact link

**Files:**
- Modify: `app/components/AppNav.vue`
- Modify: `app/layouts/default.vue`

**Interfaces:**
- Consumes: `BrushStroke`, `MarkerUnderline` (auto-imported).

- [ ] **Step 1: Update `AppNav.vue`**

```vue
<template>
  <header class="bg-paper">
    <nav class="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="font-display text-lg font-semibold tracking-tight text-ink hover:text-slate transition-colors">
        Reece Hart
      </NuxtLink>
      <div class="flex items-center gap-5">
        <ul class="flex gap-5 text-sm font-body text-ink">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a :href="href" class="opacity-75 hover:opacity-100 transition-opacity" @click="navigate">
                <MarkerUnderline v-if="isActive" color="var(--slate)">{{ link.label }}</MarkerUnderline>
                <span v-else>{{ link.label }}</span>
              </a>
            </NuxtLink>
          </li>
        </ul>
        <button
          aria-label="Toggle dark mode"
          class="text-ink opacity-75 hover:opacity-100 transition-opacity"
          @click="toggleColorMode"
        >
          <span v-if="colorMode.value === 'dark'" class="i-ph-sun block" />
          <span v-else class="i-ph-moon block" />
        </button>
      </div>
    </nav>
    <BrushStroke />
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const links = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
]
</script>
```

Note: the Contact link is removed from `links` per the design spec (folded into About in Task 7). Dark-mode classes from the original are intentionally dropped from the header/footer border treatment since `BrushStroke` itself replaces the border — dark mode still works because the rest of the page (`default.vue` body, text colors) keeps its existing `dark:*` classes; only this component's own light-theme background changed from `bg-white` to `bg-paper`.

- [ ] **Step 2: Update `default.vue`**

```vue
<template>
  <div class="min-h-screen flex flex-col bg-paper dark:bg-neutral-950 text-ink dark:text-neutral-100 font-body">
    <AppNav />
    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <slot />
    </main>
    <footer>
      <BrushStroke flip color="var(--forest)" />
      <p class="py-6 text-center text-sm opacity-60">
        © {{ year }} Reece Hart
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
```

- [ ] **Step 3: Manually verify**

Run: `pnpm dev`, visit `/`. Confirm nav shows brush-stroke divider (not a plain border), active nav link shows `MarkerUnderline`, Contact link is gone, footer shows a flipped brush stroke above the copyright line. Toggle dark mode and confirm the page still renders sensibly (existing dark classes still apply to body/text, even though the header/footer bg is now `bg-paper`-based). Check at 375px: if the nav links wrap awkwardly, note as a known issue for a future pass — this task locks in the brush-stroke replacement, not a full mobile nav redesign (that's addressed by whichever page most needs it — flag to the user if the wrap looks broken enough to need immediate attention).

- [ ] **Step 4: Commit**

```bash
git add app/components/AppNav.vue app/layouts/default.vue
git commit -m "feat: apply brush-stroke treatment to nav and footer, drop Contact link"
```

---

## Task 7: Home page

**Files:**
- Create/Modify: `app/pages/index.vue` (currently empty)
- Delete: `app/pages/index2.vue`

**Interfaces:**
- Consumes: `ThinPenLine` (auto-imported), existing `queryCollection('blog')` pattern from the old `index2.vue`.

- [ ] **Step 1: Write `index.vue`**

```vue
<template>
  <div>
    <section class="py-12">
      <h1 class="font-display text-4xl font-semibold tracking-tight mb-3">
        Engineer. Scientist. Builder.
      </h1>
      <p class="font-body text-xl opacity-75 mb-6">
        I build systems and tools that turn complex data into understanding and ideas into impact.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <MarkerUnderline color="var(--slate)">
          <NuxtLink to="/about" class="font-body text-sm font-medium">
            About me →
          </NuxtLink>
        </MarkerUnderline>
        <MarkerUnderline color="var(--slate)">
          <NuxtLink to="/blog" class="font-body text-sm font-medium">
            Read the writing →
          </NuxtLink>
        </MarkerUnderline>
      </div>
    </section>

    <section v-if="posts?.length" class="py-8">
      <h2 class="font-display text-xl font-semibold mb-6">Recent thoughts</h2>
      <ul class="space-y-5">
        <li v-for="(post, index) in posts" :key="post.path">
          <ThinPenLine v-if="index > 0" class="mb-5" />
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
            <h3 class="font-display text-base font-medium group-hover:text-slate transition-colors mt-0.5">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="font-body text-sm opacity-75 mt-1">
              {{ post.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/blog" class="inline-block mt-6 font-body text-sm text-slate hover:opacity-75 transition-opacity">
        All posts →
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Reece Hart', description: 'Computational biologist, bioinformaticist, and software engineer.' })

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .limit(5)
    .all(),
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
```

- [ ] **Step 2: Delete the old placeholder**

```bash
git rm app/pages/index2.vue
```

- [ ] **Step 3: Manually verify**

Run: `pnpm dev`, visit `/`. Confirm hero renders in Source Serif 4, body text in Inter, both nav links show a slate `MarkerUnderline`, recent-thoughts list shows a `ThinPenLine` between (not before the first) entry. Check at 375px: hero text wraps cleanly, the two link buttons wrap to their own lines without crowding.

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: redesign Home page with parchment & ink theme"
```

---

## Task 8: About page (absorb Contact)

**Files:**
- Modify: `app/pages/about.vue`
- Delete: `app/pages/contact.vue`
- Modify: `content/pages/about.md` (remove the now-redundant "see the contact page" line, since contact info is now inline on the same page)

**Interfaces:**
- Consumes: `SketchPlaceholder` (auto-imported).

- [ ] **Step 1: Update `content/pages/about.md`**

```markdown
---
title: About
---

I'm a computational biologist and bioinformaticist with deep experience in genomics and structural biology. I work at the intersection of biology, mathematics, and software.
```

- [ ] **Step 2: Update `app/pages/about.vue`**

```vue
<template>
  <div class="font-body text-ink">
    <h1 class="font-display text-3xl font-semibold tracking-tight mb-8">About</h1>

    <div class="grid sm:grid-cols-2 gap-8 items-center mb-12">
      <div class="prose-container">
        <ContentRenderer v-if="page" :value="page" />
        <p v-else class="opacity-60">Coming soon.</p>
      </div>
      <SketchPlaceholder label="Diagram: data, domain, and design intersecting" />
    </div>

    <section class="mb-12">
      <h2 class="font-display text-xl font-semibold mb-6">What I do</h2>
      <div class="grid sm:grid-cols-3 gap-6">
        <div v-for="item in whatIDo" :key="item.title">
          <h3 class="font-display font-medium mb-1">{{ item.title }}</h3>
          <p class="text-sm opacity-75">{{ item.body }}</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-display text-xl font-semibold mb-4">Contact</h2>
      <p class="text-sm opacity-75 mb-3">The best way to reach me is by email.</p>
      <ul class="space-y-2 text-sm">
        <li>
          Email: <a href="mailto:reece@reecehart.com" class="text-slate hover:opacity-75 transition-opacity">reece@reecehart.com</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/reece" target="_blank" rel="noopener noreferrer" class="text-slate hover:opacity-75 transition-opacity">github.com/reece</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'About · Reece Hart' })

const { data: page } = await useAsyncData('about', () =>
  queryCollection('pages').path('/about').first(),
)

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: "I dig into complex problems, make sense of the messy parts, and find the signal." },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
```

- [ ] **Step 3: Delete the standalone Contact page**

```bash
git rm app/pages/contact.vue
```

- [ ] **Step 4: Manually verify**

Run: `pnpm dev`, visit `/about`. Confirm bio + placeholder sit side-by-side on desktop, "What I do" shows 3 columns, contact section shows working `mailto:` and GitHub links. Check at 375px: bio/placeholder stack into a single column (not squeezed side-by-side), "What I do" collapses to 1 column. Visit `/contact` directly and confirm it now 404s (expected — page removed).

- [ ] **Step 5: Commit**

```bash
git add app/pages/about.vue content/pages/about.md
git commit -m "feat: redesign About page, fold in Contact"
```

---

## Task 9: Writing / blog index page

**Files:**
- Modify: `app/pages/blog/index.vue`

**Interfaces:**
- Consumes: `ThinPenLine` (auto-imported).
- Uses existing `post.tags` field (already `z.array(z.string()).optional()` in `content.config.ts` — no schema change).

- [ ] **Step 1: Update `app/pages/blog/index.vue`**

```vue
<template>
  <div class="font-body text-ink">
    <h1 class="font-display text-3xl font-semibold tracking-tight mb-2">Writing</h1>
    <p class="text-sm opacity-75 mb-8">
      Notes, essays, and ideas on engineering, data, and making a positive impact.
    </p>

    <div v-if="tags.length" class="flex gap-4 overflow-x-auto pb-2 mb-8 text-sm font-medium">
      <button
        class="whitespace-nowrap transition-opacity"
        :class="activeTag === null ? 'opacity-100 text-slate' : 'opacity-60 hover:opacity-100'"
        @click="activeTag = null"
      >
        All
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        class="whitespace-nowrap transition-opacity"
        :class="activeTag === tag ? 'opacity-100 text-slate' : 'opacity-60 hover:opacity-100'"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <ul v-if="filteredPosts.length" class="space-y-8">
      <li v-for="(post, index) in filteredPosts" :key="post.path">
        <ThinPenLine v-if="index > 0" class="mb-8" />
        <NuxtLink :to="post.path" class="group block">
          <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
          <h2 class="font-display text-lg font-semibold group-hover:text-slate transition-colors mt-0.5">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="text-sm opacity-75 mt-1">
            {{ post.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="opacity-60">
      No posts{{ activeTag ? ` tagged "${activeTag}"` : '' }} yet.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Writing · Reece Hart', description: 'Writing on genomics, bioinformatics, and software.' })

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

const activeTag = ref<string | null>(null)

const tags = computed(() => {
  const all = (posts.value ?? []).flatMap(post => post.tags ?? [])
  return [...new Set(all)].sort()
})

const filteredPosts = computed(() => {
  if (!activeTag.value)
    return posts.value ?? []
  return (posts.value ?? []).filter(post => post.tags?.includes(activeTag.value!))
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
```

- [ ] **Step 2: Manually verify**

Run: `pnpm dev`, visit `/blog`. Since `hello-world.md` currently has no `tags` set, confirm the tag row is hidden entirely (`tags.length` is 0) and the post list still renders correctly — this is the sparse/single-post/no-tags case called out in the spec's verification section. Temporarily add `tags: ["engineering"]` to `content/blog/hello-world.md` frontmatter, confirm the tag pill row now appears with "All" and "engineering", and clicking "engineering" still shows the post while clicking a nonexistent tag would show the empty state. Revert the temporary frontmatter change afterward (or keep it if it's a reasonable real tag — confirm with the user before deciding). Check at 375px: tag row scrolls horizontally rather than wrapping.

- [ ] **Step 3: Commit**

```bash
git add app/pages/blog/index.vue
git commit -m "feat: redesign Writing/blog index page with tag filtering"
```

---

## Task 10: Blog post page

**Files:**
- Modify: `app/pages/blog/[slug].vue`

**Interfaces:**
- Consumes: `MarkerUnderline`, `PencilNote` (auto-imported).

- [ ] **Step 1: Update `app/pages/blog/[slug].vue`**

```vue
<template>
  <article v-if="post" class="font-body text-ink">
    <header class="mb-8">
      <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
      <h1 class="mt-1 mb-3">
        <MarkerUnderline color="var(--slate)">
          <span class="font-display text-3xl font-semibold tracking-tight">{{ post.title }}</span>
        </MarkerUnderline>
      </h1>
      <p v-if="post.description" class="opacity-75">
        {{ post.description }}
      </p>
    </header>

    <details v-if="toc.length" class="mb-8 md:hidden border border-tan rounded p-3">
      <summary class="text-sm font-medium cursor-pointer">On this page</summary>
      <ul class="mt-2 space-y-1 text-sm">
        <li v-for="item in toc" :key="item.id">
          <a :href="`#${item.id}`" class="opacity-75 hover:opacity-100">{{ item.text }}</a>
        </li>
      </ul>
    </details>

    <div class="md:grid md:grid-cols-[minmax(0,1fr)_180px] md:gap-10">
      <div class="prose-container">
        <ContentRenderer :value="post" />
      </div>
      <nav v-if="toc.length" class="hidden md:block">
        <p class="text-xs uppercase tracking-wide opacity-50 mb-2">On this page</p>
        <ul class="space-y-2 text-sm sticky top-6">
          <li v-for="item in toc" :key="item.id">
            <a :href="`#${item.id}`" class="opacity-75 hover:opacity-100 hover:text-slate transition-colors">{{ item.text }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </article>
  <div v-else class="opacity-60">
    Post not found.
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('blog').path(`/blog/${route.params.slug}`).first(),
)

if (post.value) {
  useSeoMeta({
    title: `${post.value.title} · Reece Hart`,
    description: post.value.description,
  })
}

const toc = computed(() =>
  post.value?.body?.toc?.links?.map(link => ({ id: link.id, text: link.text })) ?? [],
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
```

Note on `toc`: `@nuxt/content` generates a table of contents at `post.body.toc.links` automatically for every page when headings are present — no extra config needed beyond what's already in `content.config.ts`. If `hello-world.md` (the only current post) has no headings, `toc` will be an empty array and both TOC blocks correctly stay hidden (`v-if="toc.length"`).

The `PencilNote` component is intentionally not wired into blockquote styling in this task — `@nuxt/content`'s `ContentRenderer` renders blockquotes as plain HTML `<blockquote>` elements with no built-in slot for injecting a component beside them. Styling blockquotes to include a `PencilNote` accent requires either a global CSS rule (`:global(.prose-container blockquote::before)`) or a custom Markdown renderer override, both of which are a distinct, larger piece of work than this plan's scope. Flag to the user as a follow-up once there's a real post with a blockquote to design against.

- [ ] **Step 2: Manually verify**

Run: `pnpm dev`, visit `/blog/hello-world`. Confirm title shows a slate `MarkerUnderline`, TOC section is hidden (post has no headings currently). Temporarily add a `## Section` heading to `content/blog/hello-world.md`, confirm the TOC now appears — as a `<details>` disclosure on mobile (375px) and as a sticky right-column sidebar on desktop. Revert the temporary heading afterward.

- [ ] **Step 3: Commit**

```bash
git add app/pages/blog/[slug].vue
git commit -m "feat: redesign blog post page with TOC and MarkerUnderline title"
```

---

## Task 11: Full-site responsive pass

**Files:** None (verification-only task — no new code expected unless issues are found).

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: all component specs pass.

- [ ] **Step 2: Walk every page at desktop and 375px width**

Run: `pnpm dev`. Visit `/`, `/about`, `/blog`, `/blog/hello-world`, `/visual-language` at both a desktop width (e.g. 1280px) and 375px (use browser dev tools device toolbar). For each, confirm: no horizontal overflow/scrollbar, text remains readable (not overlapping brush-stroke SVGs), tap targets (nav links, tag pills) are reasonably sized, and the nav's link row from Task 6 doesn't wrap awkwardly (this was flagged as a possible follow-up in Task 6 — resolve it now if it looks broken, e.g. by wrapping the link `<ul>` or moving to a simple stacked layout under the logo on narrow screens).

- [ ] **Step 3: Fix any issues found, committing per fix**

If Step 2 surfaces problems, fix them with small targeted commits (e.g. `fix: prevent nav link wrap on mobile`), re-verifying at 375px after each fix.

- [ ] **Step 4: Final commit confirming the pass**

If no code changes were needed in Steps 2–3, no commit is required for this task — it was verification-only. If fixes were made, ensure each has already been committed individually in Step 3.

---

## Self-Review Notes

- **Spec coverage:** palette ✓ (Task 1), fonts ✓ (Task 1), all 4 line components ✓ (Tasks 2–3), `SketchPlaceholder` ✓ (Task 4), `/visual-language` ✓ (Task 5), nav/footer brush treatment ✓ (Task 6), Home ✓ (Task 7), About + Contact fold-in ✓ (Task 8), Writing/tag-filter ✓ (Task 9), blog post + TOC ✓ (Task 10), responsive pass ✓ (Task 11), dark mode preserved throughout (explicitly called out per-task), texture utility classes — **gap found and resolved below**.
- **Gap resolved:** the design spec mentions paper-grain texture utility classes (`.texture-paper` etc.) as a "used sparingly" enhancement, but no task above creates them, since the spec doesn't identify a specific page/component that requires one yet. Rather than force an unused utility class into the plan, this is intentionally deferred — added as a follow-up once a specific application is identified (e.g. "the About page's placeholder panel could use a subtle paper-grain background"). Flagging here so it isn't silently dropped.
- **Type/interface consistency:** `color` prop name and default pattern (`withDefaults(defineProps<...>())`) used consistently across all 5 ink components. `useId()` usage in `BrushStroke` confirmed as Vue 3.5+ built-in (Nuxt 4 ships Vue 3.5+).
- **No placeholders:** every step has literal code, not "similar to Task N" references.
