# BrushImage Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `BrushImage.vue` component that renders one of four raster bristle-texture webp images (`brush1`–`brush4`), recolorable via CSS `mask-image` and flippable horizontally/vertically/both, without touching the existing SVG-based `BrushStroke.vue`/`HeaderBrush.vue`.

**Architecture:** The four webp files move from the repo root into `app/assets/brushes/`. `BrushImage.vue` imports all four as URL strings (static imports, so Vite/vitest resolve them identically), picks one by the `name` prop, and renders a single decorative `<div>` whose `background-color` (the `color` prop) is clipped to the image's alpha shape via `mask-image`/`-webkit-mask-image`. Flip is a CSS `transform` driven by the `flip` prop.

**Tech Stack:** Vue 3 `<script setup>`, Nuxt 4 auto-imported components (`~/components/ink`), Vite static asset imports, Vitest + `@vue/test-utils` + `happy-dom`.

## Global Constraints

- No replacement of `BrushStroke.vue` or `HeaderBrush.vue` — both are left untouched, per spec non-goals.
- No vectorization/tracing of the webp art into SVG.
- No random/rotating selection — caller always passes `name` explicitly.
- No build-time generation of pre-colored image variants.
- `color` prop defaults to `currentColor` (spec keeps this prop even though no current call site needs a non-default color — banked for future use, per spec discussion).
- Decorative markup convention: `role="presentation" aria-hidden="true"` on the wrapper (matches `BrushStroke.vue`/`HeaderBrush.vue`).
- Component lives in `app/components/ink/` so it's auto-imported globally (see `nuxt.config.ts` → `components: [{ path: '~/components/ink', pathPrefix: false }]`) — no manual import needed at call sites.
- Use relative imports for the webp assets inside `BrushImage.vue` (not the `~/` alias) — the standalone `vitest.config.ts` has no Nuxt alias injection, and no existing app source file relies on `~/` today, so relative imports are the only path proven to resolve under both Nuxt's build and Vitest.

---

## File Structure

- **Move:** `brush1.webp`, `brush2.webp`, `brush3.webp`, `brush4.webp` from repo root → `app/assets/brushes/`.
- **Create:** `app/components/ink/BrushImage.vue` — the component itself.
- **Create:** `tests/components/ink/BrushImage.spec.ts` — unit tests.
- **Modify:** `app/pages/visual-language.vue` — add a demonstration row under the existing "Brush Strokes" section showing all four `BrushImage` variants.

---

### Task 1: Move brush assets into the asset pipeline

**Files:**
- Move: `brush1.webp` → `app/assets/brushes/brush1.webp`
- Move: `brush2.webp` → `app/assets/brushes/brush2.webp`
- Move: `brush3.webp` → `app/assets/brushes/brush3.webp`
- Move: `brush4.webp` → `app/assets/brushes/brush4.webp`

**Interfaces:**
- Produces: four files at `app/assets/brushes/brush{1,2,3,4}.webp`, consumed by Task 2's imports.

- [ ] **Step 1: Create the target directory and move the files**

```bash
mkdir -p app/assets/brushes
git mv brush1.webp app/assets/brushes/brush1.webp
git mv brush2.webp app/assets/brushes/brush2.webp
git mv brush3.webp app/assets/brushes/brush3.webp
git mv brush4.webp app/assets/brushes/brush4.webp
```

- [ ] **Step 2: Verify the move**

Run: `ls app/assets/brushes/ && ls brush*.webp 2>&1`
Expected: the four files listed under `app/assets/brushes/`, and `ls brush*.webp` at repo root reports "No such file or directory".

- [ ] **Step 3: Commit**

```bash
git add -A brush1.webp brush2.webp brush3.webp brush4.webp app/assets/brushes
git commit -m "chore: move brush webp assets into app/assets/brushes"
```

---

### Task 2: Build `BrushImage.vue`

**Files:**
- Create: `app/components/ink/BrushImage.vue`
- Test: `tests/components/ink/BrushImage.spec.ts`

**Interfaces:**
- Produces: `BrushImage` component, props `{ name: 'brush1' | 'brush2' | 'brush3' | 'brush4', color?: string, flip?: 'none' | 'horizontal' | 'vertical' | 'both' }`. Root element is a `<div>` carrying `role="presentation"`, `aria-hidden="true"`, and an inline `style` string containing `background-color`, `mask-image`, `-webkit-mask-image`, `mask-size`, `-webkit-mask-size`, `mask-repeat`, `-webkit-mask-repeat`, and (when `flip !== 'none'`) `transform`.
- Consumes: nothing from earlier tasks besides the asset files moved in Task 1.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/components/ink/BrushImage.spec.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BrushImage from '../../../app/components/ink/BrushImage.vue'

describe('brushImage', () => {
  it('renders a div marked as decorative', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('presentation')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('sets a mask-image for each valid brush name', () => {
    const names = ['brush1', 'brush2', 'brush3', 'brush4'] as const
    for (const name of names) {
      const wrapper = mount(BrushImage, { props: { name } })
      const style = wrapper.attributes('style') ?? ''
      expect(style).toContain('mask-image')
      expect(style).toContain('-webkit-mask-image')
    }
  })

  it('defaults background-color to currentColor', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.attributes('style')).toContain('background-color: currentColor')
  })

  it('applies the color prop as background-color', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', color: '#6A7C6E' } })
    expect(wrapper.attributes('style')).toContain('background-color: #6A7C6E')
  })

  it('applies no transform by default', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.attributes('style') ?? '').not.toContain('transform')
  })

  it('applies scaleX(-1) when flip is horizontal', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'horizontal' } })
    expect(wrapper.attributes('style')).toContain('transform: scaleX(-1)')
  })

  it('applies scaleY(-1) when flip is vertical', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'vertical' } })
    expect(wrapper.attributes('style')).toContain('transform: scaleY(-1)')
  })

  it('applies scale(-1, -1) when flip is both', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'both' } })
    expect(wrapper.attributes('style')).toContain('transform: scale(-1, -1)')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/components/ink/BrushImage.spec.ts`
Expected: FAIL — `Cannot find module '../../../app/components/ink/BrushImage.vue'` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```vue
<!-- app/components/ink/BrushImage.vue -->
<template>
  <div
    role="presentation"
    aria-hidden="true"
    class="w-full h-16 md:h-24"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import brush1 from '../../assets/brushes/brush1.webp'
import brush2 from '../../assets/brushes/brush2.webp'
import brush3 from '../../assets/brushes/brush3.webp'
import brush4 from '../../assets/brushes/brush4.webp'

const BRUSH_URLS = {
  brush1,
  brush2,
  brush3,
  brush4,
} as const

const props = withDefaults(defineProps<{
  name: keyof typeof BRUSH_URLS
  color?: string
  flip?: 'none' | 'horizontal' | 'vertical' | 'both'
}>(), {
  color: 'currentColor',
  flip: 'none',
})

const TRANSFORMS = {
  none: undefined,
  horizontal: 'scaleX(-1)',
  vertical: 'scaleY(-1)',
  both: 'scale(-1, -1)',
} as const

const style = computed(() => {
  const url = BRUSH_URLS[props.name]
  const maskProps = {
    'background-color': props.color,
    'mask-image': `url(${url})`,
    '-webkit-mask-image': `url(${url})`,
    'mask-size': '100% 100%',
    '-webkit-mask-size': '100% 100%',
    'mask-repeat': 'no-repeat',
    '-webkit-mask-repeat': 'no-repeat',
  }
  const transform = TRANSFORMS[props.flip]
  return transform ? { ...maskProps, transform } : maskProps
})
</script>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/components/ink/BrushImage.spec.ts`
Expected: PASS (all 8 tests).

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npm run test`
Expected: PASS (all existing tests plus the 8 new ones, no regressions in `BrushStroke.spec.ts`/`HeaderBrush.spec.ts`).

- [ ] **Step 6: Commit**

```bash
git add app/components/ink/BrushImage.vue tests/components/ink/BrushImage.spec.ts
git commit -m "feat: add BrushImage component for raster brush textures"
```

---

### Task 3: Demonstrate `BrushImage` on the visual-language page

**Files:**
- Modify: `app/pages/visual-language.vue:84-99` (existing "Brush Strokes" `<section>`)

**Interfaces:**
- Consumes: `BrushImage` component from Task 2 (auto-imported, no explicit import statement needed).

- [ ] **Step 1: Add a demonstration block for all four brush images**

In `app/pages/visual-language.vue`, inside the existing "Brush Strokes" `<section>` (currently lines 84–99), add a new `<div>` after the two existing `BrushStroke` examples (before the closing `</div>` of `.space-y-6`, i.e. after line 97's `</div>`):

```vue
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Brush image — raster texture, recolorable via
              CSS mask</p>
            <div class="grid grid-cols-2 gap-4">
              <BrushImage name="brush1" color="var(--slate)" />
              <BrushImage name="brush2" color="var(--forest)" />
              <BrushImage name="brush3" color="var(--rust)" />
              <BrushImage name="brush4" color="var(--ink)" />
            </div>
          </div>
```

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev`, navigate to `/visual-language`, confirm all four brush textures render in their assigned colors with no console errors, then stop the dev server.

- [ ] **Step 3: Run the full test suite**

Run: `npm run test`
Expected: PASS (no test covers page content directly, so this just confirms no regressions).

- [ ] **Step 4: Commit**

```bash
git add app/pages/visual-language.vue
git commit -m "feat: demonstrate BrushImage variants on visual-language page"
```

---

## Self-Review Notes

- **Spec coverage:** asset move (Task 1), `mask-image` technique + `color`/`flip`/`name` props (Task 2), sizing convention matching `BrushStroke` (Task 2 template), decorative accessibility markup (Task 2 template + tests), demonstration on `visual-language.vue` (Task 3) — all spec sections covered. Testing section's four required assertions (renders per name, color applied, flip transforms, decorative markup) are all present in Task 2's test file.
- **Open questions from spec resolved:** exact height utility settled as `w-full h-16 md:h-24` (matches `BrushStroke`'s existing convention, per spec's stated intent to reuse it); `visual-language.vue` update resolved as a new demonstration row in Task 3.
- **Type consistency:** `name`/`color`/`flip` prop names and the `'none' | 'horizontal' | 'vertical' | 'both'` union are identical across the spec, Task 2's interface note, implementation, and tests.
