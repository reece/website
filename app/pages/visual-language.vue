<template>
  <div class="font-body text-ink">
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
        <h2 class="font-display text-xl font-semibold mb-4">Color palette</h2>

        <table class="w-full mt-8 text-sm border-collapse">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left font-medium py-2 pr-4">Swatch</th>
              <th class="text-left font-medium py-2 pr-4">Token</th>
              <th class="text-left font-medium py-2 pr-4">Color</th>
              <th class="text-left font-medium py-2">Uses</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="color in colors" :key="color.name" class="border-b border-border">
              <td class="py-3 pr-4">
                <RoughSwatch :fill="color.value" :text-color="color.textOn" :seed="color.seed"
                  class="w-28 h-7 sm:w-40 sm:h-10" />
              </td>
              <td class="py-3 pr-4 align-middle">
                <span v-if="color.roles.length === 0" class="opacity-50 italic">unassigned</span>
                <code v-else class="text-xs">{{ color.roles.join(', ') }}</code>
              </td>
              <td class="py-3 pr-4 align-middle opacity-80 whitespace-nowrap">
                <div>{{ color.name }}</div>
                <div class="text-xs">{{ color.hex }}</div>
                <div class="text-xs">{{ color.oklch }}</div>
              </td>
              <td class="py-3 align-middle opacity-80">{{ color.uses }}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-8 space-y-4">
          <div class="bg-background border border-border rounded p-4">
            <p class="text-xs uppercase tracking-wide opacity-60 mb-2">
              <code>bg-background</code> + <code>border-border</code>
            </p>
            <p class="text-foreground">
              A card using <code>bg-background</code> for its fill, <code>border-border</code> for its edge, and
              <code>text-foreground</code> (below) for body copy.
            </p>
          </div>

          <p>
            <code>text-headings</code> for a heading:
            <span class="block font-display text-xl font-semibold text-headings">A Sample Heading</span>
          </p>

          <p class="text-foreground">
            <code>text-primary</code> / <code>text-accent</code> for a
            <a href="#" class="text-accent hover:opacity-75 transition-opacity">link like this one</a>.
          </p>

          <p class="text-foreground">
            <code>text-secondary</code> for de-emphasized supporting text, such as a
            <span class="text-secondary">figure caption</span> or metadata line.
          </p>

          <p class="text-foreground">
            <code>text-highlight</code> reserved for a
            <span class="text-highlight font-medium">standout callout</span> when something needs real visual pop.
          </p>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Typography</h2>
        <p class="font-display text-3xl">Aa — Headings: Source Serif 4</p>
        <p class="font-body text-lg mt-2">Aa — Body: Inter</p>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Brush Strokes</h2>
        <p class="text-sm mb-6">
          Two families: <code>MaskImage</code> (raster webp, recolored via CSS <code>mask-image</code>) and
          <code>BrushStroke</code> (procedural SVG with a turbulence filter). <code>MaskImage</code> accepts
          <code>name</code> (a <code>"directory/basename"</code> slug), <code>color</code> (any CSS color, via
          mask), <code>flip</code> (<code>none</code> / <code>horizontal</code> / <code>vertical</code> /
          <code>both</code>), and <code>heightScale</code> (shrink the rendered height below its natural aspect
          ratio).
        </p>
        <div class="space-y-8">
          <div>
            <h3 class="font-display text-lg font-semibold mb-3">Brush Image</h3>
            <div class="space-y-4">
              <div>
                <MaskImage name="brushes/thick-taper-1" color="var(--slate)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="brushes/thick-taper-1" color="var(--slate)" /&gt;</code>
              </div>
              <div>
                <MaskImage name="brushes/thick-box-taper-1" color="var(--forest)" flip="horizontal" />
                <code class="text-xs opacity-60">&lt;MaskImage name="brushes/thick-box-taper-1" color="var(--forest)" flip="horizontal" /&gt;</code>
              </div>
              <div>
                <MaskImage name="brushes/medium-taper-1" color="var(--rust)" :height-scale="0.5" />
                <code class="text-xs opacity-60">&lt;MaskImage name="brushes/medium-taper-1" color="var(--rust)" :height-scale="0.5" /&gt;</code>
              </div>
              <div>
                <MaskImage name="brushes/medium-taper-2" color="var(--ink)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="brushes/medium-taper-2" color="var(--ink)" /&gt;</code>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-display text-lg font-semibold mb-3">Brush Stroke</h3>
            <div class="space-y-4">
              <div>
                <BrushStroke />
                <code class="text-xs opacity-60">&lt;BrushStroke /&gt;</code>
              </div>
              <div>
                <BrushStroke color="var(--ink)" />
                <code class="text-xs opacity-60">&lt;BrushStroke color="var(--ink)" /&gt;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Ink Dividers</h2>
        <div class="space-y-6">
          <div>
            <h3 class="font-display text-lg font-semibold mb-3">Thin Pen Line</h3>
            <div class="space-y-4">
              <div>
                <ThinPenLine />
                <code class="text-xs opacity-60">&lt;ThinPenLine /&gt;</code>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-display text-lg font-semibold mb-3">Line Image</h3>
            <div class="space-y-4">
              <div>
                <MaskImage name="lines/thin" color="var(--slate)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="lines/thin" color="var(--slate)" /&gt;</code>
              </div>
              <div>
                <MaskImage name="lines/medium" color="var(--forest)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="lines/medium" color="var(--forest)" /&gt;</code>
              </div>
              <div>
                <MaskImage name="lines/thick" color="var(--rust)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="lines/thick" color="var(--rust)" /&gt;</code>
              </div>
              <div>
                <MaskImage name="lines/dotted" color="var(--ink)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="lines/dotted" color="var(--ink)" /&gt;</code>
              </div>
              <div>
                <MaskImage name="lines/wavy" color="var(--slate)" />
                <code class="text-xs opacity-60">&lt;MaskImage name="lines/wavy" color="var(--slate)" /&gt;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Underlines</h2>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Marker underline — for links and highlights</p>
            <MarkerUnderline color="var(--slate)">
              <span class="font-display text-lg">Sample link text</span>
            </MarkerUnderline>
            <div class="mt-2">
              <code class="text-xs opacity-60">&lt;MarkerUnderline color="var(--slate)"&gt;Sample link text&lt;/MarkerUnderline&gt;</code>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Illustration placeholder</h2>
        <SketchPlaceholder label="Sample illustration placeholder" class="max-w-sm" />
        <code class="text-xs opacity-60 mt-2 block">&lt;SketchPlaceholder label="Sample illustration placeholder" /&gt;</code>
      </section>
    </div>

    <BrushStroke color="var(--ink)" flip />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank' })

useSeoMeta({ title: 'Visual Language · Reece Hart' })

const tiers = [
  {
    name: 'light',
    swatches: [
      { name: 'white', value: '#FFFFFF', textOn: 'var(--ink)', hex: '#FFFFFF' },
      { name: 'paper', value: 'var(--paper)', textOn: 'var(--ink)', hex: '#FAF8F5' },
      { name: 'linen', value: 'var(--linen)', textOn: 'var(--ink)', hex: '#EFEAE1' },
      { name: 'sand', value: 'var(--sand)', textOn: 'var(--ink)', hex: '#E5E1D6' },
    ],
  },
  {
    name: 'dark',
    swatches: [
      { name: 'ink', value: 'var(--ink)', textOn: 'var(--paper)', hex: '#52504A' },
      { name: 'slate', value: 'var(--slate)', textOn: 'var(--paper)', hex: '#365C7A' },
      { name: 'forest', value: 'var(--forest)', textOn: 'var(--paper)', hex: '#6A7C6E' },
      { name: 'rust', value: 'var(--rust)', textOn: 'var(--paper)', hex: '#BC5324' },
    ],
  },
]

const colors = [
  { name: 'white', value: '#FFFFFF', textOn: 'var(--ink)', seed: 0, roles: [], uses: 'Unassigned.', hex: '#FFFFFF', oklch: 'oklch(100.0% 0 0)' },
  { name: 'paper', value: 'var(--paper)', textOn: 'var(--ink)', seed: 1, roles: ['background'], uses: 'Page and section background.', hex: '#FAF8F5', oklch: 'oklch(98.0% 0.0045 78.3)' },
  { name: 'linen', value: 'var(--linen)', textOn: 'var(--ink)', seed: 2, roles: [], uses: 'Unassigned.', hex: '#EFEAE1', oklch: 'oklch(93.8% 0.0132 82.4)' },
  { name: 'sand', value: 'var(--sand)', textOn: 'var(--ink)', seed: 3, roles: ['border'], uses: 'Dividers and box borders (e.g. mobile TOC, contrast backdrop).', hex: '#E5E1D6', oklch: 'oklch(91.0% 0.0154 90.2)' },
  { name: 'ink', value: 'var(--ink)', textOn: 'var(--paper)', seed: 4, roles: ['foreground'], uses: 'Primary body text.', hex: '#52504A', oklch: 'oklch(43.1% 0.0100 91.6)' },
  { name: 'slate', value: 'var(--slate)', textOn: 'var(--paper)', seed: 5, roles: ['primary', 'headings', 'accent'], uses: 'Links, hover states, active nav/tag — the main interactive color.', hex: '#365C7A', oklch: 'oklch(46.0% 0.0656 243.7)' },
  { name: 'forest', value: 'var(--forest)', textOn: 'var(--paper)', seed: 6, roles: ['secondary', 'subheadings'], uses: 'Reserved for a secondary accent (not yet used).', hex: '#6A7C6E', oklch: 'oklch(56.7% 0.0301 152.0)' },
  { name: 'rust', value: 'var(--rust)', textOn: 'var(--paper)', seed: 7, roles: ['highlight'], uses: 'Reserved for visual emphasis/pop (not yet used).', hex: '#BC5324', oklch: 'oklch(56.9% 0.1479 42.3)' },
]
</script>
