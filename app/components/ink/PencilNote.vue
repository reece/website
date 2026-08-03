<template>
  <div role="presentation" aria-hidden="true" class="w-8 h-8">
    <svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4,20 C 8,14 6,8 12,10 C 18,12 14,20 20,18 C 24,16.5 22,22 28,20"
        :stroke="color"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        opacity="0.7"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: 'var(--ink)',
})
</script>
