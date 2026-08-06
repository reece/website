<template>
  <div class="min-h-screen max-w-4xl mx-auto px-6 flex flex-col bg-paper dark:bg-neutral-950 text-ink dark:text-neutral-100 font-body">
    <MaskImage name="brushes/thick-box-taper-1" color="var(--primary)" :height-scale="0.8" />

    <main class="flex-1 w-full px-6 py-10">
      <slot />
    </main>

    <footer>
      <div class="relative">
        <MaskImage name="brushes/medium-taper-2" color="var(--secondary)" :height-scale="0.8" flip="both" />
        <p class="absolute inset-0 flex items-center justify-center text-sm text-background">
          © {{ year }} Reece Hart
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
