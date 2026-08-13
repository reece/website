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
/**
 * Hand-drawn brush-stroke band: a filled wavy shape with an overlaid stroke and ink-speckle
 * texture, roughened via feTurbulence/feDisplacementMap. Used as a decorative section divider.
 *
 * @example
 * <BrushStroke color="var(--accent)" flip />
 */
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  /** CSS color for the stroke fill; accepts any valid CSS color value or var(). */
  color?: string
  /** Mirror the stroke vertically. */
  flip?: boolean
}>(), {
  color: 'var(--accent)',
  flip: false,
})

const instanceId = useId()
const roughId = `brush-rough-${instanceId}`
const speckleId = `brush-speckle-${instanceId}`
const seed = 7
</script>
