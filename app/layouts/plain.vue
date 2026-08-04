<template>
  <div class="min-h-screen flex flex-col bg-paper dark:bg-neutral-950 text-ink dark:text-neutral-100 font-body">
    <MaskImage name="brushes/thick-box-taper-1" color="var(--primary)" :height-scale="0.8" />

    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <slot />
    </main>
    <MaskImage name="brushes/medium-taper-2" color="var(--secondary)" :height-scale="0.8" flip="both" />
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
