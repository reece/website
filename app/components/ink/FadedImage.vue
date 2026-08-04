<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    class="w-full h-full object-cover rounded-xl"
    :style="faded ? maskStyle : undefined"
  />
</template>

<script setup lang="ts">
/**
 * Photo with rounded corners and an optional radial-gradient fade to transparent at the
 * edges, for dropping real photography into the ink design system without a hard rectangle.
 *
 * @example
 * <FadedImage src="/images/sf-from-marin.png" alt="San Francisco Bay seen from Marin" faded />
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Path to the image, resolved by the configured NuxtImg provider (e.g. a /public path). */
  src: string
  /** Accessible alt text. */
  alt: string
  /** Fade the image to transparent at the edges via a radial-gradient mask. */
  faded?: boolean
}>(), {
  faded: false,
})

const maskStyle = computed(() => {
  const gradient = 'radial-gradient(ellipse farthest-side at center, black 70%, transparent 100%)'
  return `mask-image: ${gradient}; -webkit-mask-image: ${gradient}`
})
</script>
