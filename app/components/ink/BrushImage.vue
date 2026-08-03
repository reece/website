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

// Built as a string, not an object: happy-dom's CSSOM drops mask-image on object-form :style bindings, which would break the tests (no real-browser impact).
const style = computed(() => {
  const url = BRUSH_URLS[props.name]
  const parts = [
    `background-color: ${props.color}`,
    `mask-image: url(${url})`,
    `-webkit-mask-image: url(${url})`,
    `mask-size: 100% 100%`,
    `-webkit-mask-size: 100% 100%`,
    `mask-repeat: no-repeat`,
    `-webkit-mask-repeat: no-repeat`,
  ]
  const transform = TRANSFORMS[props.flip]
  if (transform) parts.push(`transform: ${transform}`)
  return parts.join('; ')
})
</script>
