<template>
  <div class="relative w-full h-full rounded-xl overflow-hidden">
    <NuxtImg :src="src" :alt="alt" class="w-full h-full object-cover" :style="{ objectPosition: position }" />
    <div v-if="faded" class="absolute inset-0 pointer-events-none" :style="fadeStyle" />
  </div>
</template>

<script setup lang="ts">
/**
 * Photo with rounded corners and, optionally, a soft fade to the page background around
 * its entire perimeter — for dropping real photography into the ink design system without
 * a hard-edged rectangle.
 *
 * @example
 * <FadedImage src="/images/sf-from-marin.webp" alt="San Francisco Bay seen from Marin" faded />
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Path to the image, resolved by the configured NuxtImg provider (e.g. a /public path). */
  src: string
  /** Accessible alt text. */
  alt: string
  /** Fade the image to the page background around its perimeter via an inset box-shadow. */
  faded?: boolean
  /** CSS object-position value; biases which point of the image stays centered as object-cover crops to fill the box. */
  position?: string
}>(), {
  faded: false,
  position: '50% 50%',
})

const fadeStyle = computed(() =>
  'box-shadow: inset 0 0 2.5rem 1.5rem var(--paper); border-radius: inherit',
)
</script>
