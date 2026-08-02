<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
    <AppNav />
    <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <slot />
    </main>
    <footer class="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-sm text-neutral-500">
      © {{ year }} Reece Hart
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
