<template>
  <div class="inline-block p-[10px] bg-border">
    <div
      class="relative grid contrast-backdrop"
      :style="{ '--band-h': `${bandHeight}px`, '--band-h-sm': `${bandHeightSm}px` }"
    >
      <div class="col-start-1 row-start-1 band bg-white" />
      <div class="col-start-1 row-start-2 band bg-paper" />
      <div class="col-start-1 row-start-3 band bg-ink" />
      <div class="col-start-1 row-start-1 row-span-3 flex items-center justify-center px-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Three-band (white/paper/ink) backdrop for previewing slotted content's contrast against
 * each surface color side by side.
 *
 * @example
 * <ContrastBackdrop :swatch-size="72">
 *   <RoughSwatch fill="var(--accent)" />
 * </ContrastBackdrop>
 */
const props = withDefaults(defineProps<{
  /** Band height basis (px) at default viewport width; each band renders at 40% of this. */
  swatchSize?: number
  /** Band height basis (px) at the sm breakpoint and up. */
  swatchSizeSm?: number
}>(), {
  swatchSize: 64,
  swatchSizeSm: 80,
})

const bandHeight = computed(() => props.swatchSize * 0.4)
const bandHeightSm = computed(() => props.swatchSizeSm * 0.4)

defineSlots<{
  /** Content previewed on top of the three contrast bands. */
  default(): unknown
}>()
</script>

<style scoped>
.contrast-backdrop {
  grid-template-rows: var(--band-h) var(--band-h) var(--band-h);
}

.band {
  height: var(--band-h);
}

@media (min-width: 640px) {
  .contrast-backdrop {
    grid-template-rows: var(--band-h-sm) var(--band-h-sm) var(--band-h-sm);
  }

  .band {
    height: var(--band-h-sm);
  }
}
</style>
