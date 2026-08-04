<template>
  <div class="relative">
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      class="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        <filter :id="roughId" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.055" numOctaves="2" :seed="seed" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="10"
        :fill="fill"
        :filter="`url(#${roughId})`"
      />
    </svg>
    <div class="relative w-full h-full flex flex-col items-center justify-center gap-0.5 text-xs text-center" :style="{ color: textColor }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Hand-drawn, rough-edged swatch: an SVG rect roughened via feTurbulence/feDisplacementMap,
 * with slotted content (e.g. a label) centered on top.
 *
 * @example
 * <RoughSwatch fill="var(--accent)" text-color="var(--paper)">
 *   Accent
 * </RoughSwatch>
 */
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  /** CSS color for the swatch fill; accepts any valid CSS color value or var(). */
  fill?: string
  /** Text color for slotted content. */
  textColor?: string
  /** Seed for the fractalNoise filter — vary across sibling swatches to avoid visually identical roughness. */
  seed?: number
}>(), {
  fill: 'var(--ink)',
  textColor: 'var(--ink)',
  seed: 3,
})

defineSlots<{
  /** Label content centered over the swatch. */
  default(): unknown
}>()

const instanceId = useId()
const roughId = `swatch-fill-rough-${instanceId}`
</script>
