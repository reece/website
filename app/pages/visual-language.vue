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
        <div class="space-y-6">
          <ContrastBackdrop v-for="tier in tiers" :key="tier.name" :swatch-size="56" :swatch-size-sm="80"
            class="w-full">
            <div class="flex gap-2 sm:gap-4 justify-center">
              <RoughSwatch v-for="(swatch, index) in tier.swatches" :key="swatch.name" :fill="swatch.value"
                :text-color="swatch.textOn" :seed="index" class="w-14 h-14 sm:w-20 sm:h-20 shrink-0">
                <span class="text-[10px] sm:text-xs">{{ swatch.name }}</span>
                <span class="text-[8px] sm:text-[10px] opacity-80">{{ swatch.hex }}</span>
              </RoughSwatch>
            </div>
          </ContrastBackdrop>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Typography</h2>
        <p class="font-display text-3xl">Aa — Headings: Source Serif 4</p>
        <p class="font-body text-lg mt-2">Aa — Body: Inter</p>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Brush Strokes</h2>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Brush stroke — for section breaks and emphasis
            </p>
            <BrushStroke />
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Brush stroke — for section breaks and emphasis
            </p>
            <BrushStroke color="var(--ink)" />
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-xl font-semibold mb-4">Ink Dividers</h2>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Thin pen line — for subtle separation</p>
            <ThinPenLine />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide opacity-60 mb-1">Pencil note — for annotations and human touches
            </p>
            <PencilNote />
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
          </div>
        </div>
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
      { name: 'rust', value: 'var(--rust)', textOn: 'var(--paper)', hex: '#B7410E' },
    ],
  },
]
</script>
