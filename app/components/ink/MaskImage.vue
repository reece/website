<!-- app/components/ink/MaskImage.vue -->
<template>
  <div
    role="presentation"
    aria-hidden="true"
    class="w-full"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import thickTaper1 from '../../assets/brushes/thick-taper-1.webp'
import thickBoxTaper1 from '../../assets/brushes/thick-box-taper-1.webp'
import mediumTaper1 from '../../assets/brushes/medium-taper-1.webp'
import mediumTaper2 from '../../assets/brushes/medium-taper-2.webp'
import dotted from '../../assets/lines/dotted.webp'
import medium from '../../assets/lines/medium.webp'
import thick from '../../assets/lines/thick.webp'
import thin from '../../assets/lines/thin.webp'
import wavy from '../../assets/lines/wavy.webp'

const IMAGE_URLS = {
  'brushes/thick-taper-1': thickTaper1,
  'brushes/thick-box-taper-1': thickBoxTaper1,
  'brushes/medium-taper-1': mediumTaper1,
  'brushes/medium-taper-2': mediumTaper2,
  'lines/dotted': dotted,
  'lines/medium': medium,
  'lines/thick': thick,
  'lines/thin': thin,
  'lines/wavy': wavy,
} as const

// Native pixel dimensions of each source webp, used to preserve aspect ratio
// instead of stretching every image into the same fixed-height box.
const IMAGE_ASPECT_RATIOS = {
  'brushes/thick-taper-1': 1585 / 193,
  'brushes/thick-box-taper-1': 1508 / 188,
  'brushes/medium-taper-1': 1617 / 74,
  'brushes/medium-taper-2': 1450 / 106,
  'lines/dotted': 1417 / 11,
  'lines/medium': 1462 / 18,
  'lines/thick': 1458 / 33,
  'lines/thin': 1459 / 14,
  'lines/wavy': 1426 / 50,
} as const

const props = withDefaults(defineProps<{
  name: keyof typeof IMAGE_URLS
  color?: string
  flip?: 'none' | 'horizontal' | 'vertical' | 'both'
  heightScale?: number
}>(), {
  color: 'currentColor',
  flip: 'none',
  heightScale: 1,
})

const TRANSFORMS = {
  none: undefined,
  horizontal: 'scaleX(-1)',
  vertical: 'scaleY(-1)',
  both: 'scale(-1, -1)',
} as const

// Built as a string, not an object: happy-dom's CSSOM drops mask-image on object-form :style bindings, which would break the tests (no real-browser impact).
const style = computed(() => {
  const url = IMAGE_URLS[props.name]
  const parts = [
    `aspect-ratio: ${IMAGE_ASPECT_RATIOS[props.name] / props.heightScale}`,
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
