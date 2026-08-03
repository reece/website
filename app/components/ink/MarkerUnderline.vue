<template>
  <span class="relative inline-block">
    <slot />
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      class="absolute left-0 -bottom-1.5 w-full h-2.5 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,7 C 30,2 60,11 100,6 C 140,1 170,10 200,6"
        :stroke="color"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
        opacity="0.65"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), {
  color: 'var(--slate)',
})
</script>
