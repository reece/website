<script setup lang="ts">
/**
 * Decorative horizontal rule drawn as a hand-inked line or row of dots, for separating
 * sections without a plain HTML `<hr>`.
 *
 * @example
 * <InkRule variant="organic" color="var(--slate)" />
 *
 * @example Dotted variant
 * <InkRule variant="dotted" width="60%" />
 */
withDefaults(
  defineProps<{
    /** Line style to draw. */
    variant?: 'fine' | 'organic' | 'brush' | 'dotted' | 'squiggle'
    /** CSS width of the rule. */
    width?: string
    /** CSS color for the rule; accepts any valid CSS color value or var(). */
    color?: string
  }>(),
  {
    variant: 'organic',
    width: '100%',
    color: 'currentColor',
  },
)
</script>

<template>
  <svg
    :style="{ width, color }"
    class="ink-rule"
    viewBox="0 0 1200 36"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <template v-if="variant === 'fine'">
      <path
        d="M10 18 C250 16 520 20 1190 18"
        class="line fine"
      />
    </template>

    <template v-else-if="variant === 'organic'">
      <path
        d="M10 18
           C110 12 180 24 270 18
           C360 12 470 24 580 18
           C690 12 820 24 940 18
           C1040 14 1110 22 1190 18"
        class="line organic"
      />
    </template>

    <template v-else-if="variant === 'brush'">
      <path
        d="
          M10 14
          C180 6 340 22 520 16
          C700 10 930 24 1190 14
          L1190 24
          C930 30 700 18 520 24
          C340 30 180 18 10 24
          Z
        "
        class="brush"
      />
    </template>

    <template v-else-if="variant === 'dotted'">
      <g class="dots">
        <circle
          v-for="n in 32"
          :key="n"
          :cx="25 + (n - 1) * 37"
          cy="18"
          r="2.4"
        />
      </g>
    </template>

    <template v-else-if="variant === 'squiggle'">
      <path
        d="
          M10 18
          Q40 8 70 18
          T130 18
          T190 18
          T250 18
          T310 18
          T370 18
          T430 18
          T490 18
          T550 18
          T610 18
          T670 18
          T730 18
          T790 18
          T850 18
          T910 18
          T970 18
          T1030 18
          T1090 18
          T1150 18
        "
        class="line squiggle"
      />
    </template>
  </svg>
</template>

<style scoped>
.ink-rule {
  display: block;
  height: 24px;
}

.line {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fine {
  stroke-width: 1.6;
}

.organic {
  stroke-width: 2.2;
}

.squiggle {
  stroke-width: 2.4;
}

.brush {
  fill: currentColor;
}

.dots circle {
  fill: currentColor;
}
</style>
