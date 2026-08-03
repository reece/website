<template>
  <div class="min-h-screen flex flex-col bg-paper dark:bg-neutral-950 text-ink dark:text-neutral-100 font-body">
    <AppNav />
    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <slot />
    </main>
    <footer>
      <BrushStroke flip color="var(--forest)" />
      <p class="py-6 text-center text-sm opacity-60">
        © {{ year }} Reece Hart
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
