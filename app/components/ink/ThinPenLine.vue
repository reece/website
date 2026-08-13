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
/**
 * Thin, lightly wavy hand-drawn rule for subtle divider use (finer weight than InkRule).
 *
 * @example
 * <ThinPenLine color="var(--accent)" />
 */
withDefaults(defineProps<{
  /** CSS color for the line stroke; accepts any valid CSS color value or var(). */
  color?: string
}>(), {
  color: 'var(--ink)',
})
</script>
