<template>
  <div class="w-full aspect-video flex items-center justify-center">
    <span v-if="label" class="sr-only">{{ label }}</span>
    <svg viewBox="0 0 200 120" class="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="55" r="30" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" />
      <circle cx="95" cy="70" r="26" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" />
      <path d="M20,100 L60,40 L100,95 L140,50 L180,100" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity="0.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * Sketchy placeholder illustration (circles + a rough polyline) for empty states or
 * unfinished content slots where no real image exists yet.
 *
 * @example
 * <SketchPlaceholder label="Chart coming soon" />
 */
defineProps<{
  /** Accessible label for the placeholder, exposed via a visually-hidden span. */
  label?: string
}>()
</script>
