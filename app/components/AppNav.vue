<template>
  <header class="border-b border-neutral-200 dark:border-neutral-800">
    <nav class="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="font-semibold text-lg tracking-tight hover:text-blue-600 transition-colors">
        Reece Hart
      </NuxtLink>
      <ul class="flex gap-5 text-sm text-neutral-600 dark:text-neutral-400">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            active-class="text-neutral-900 dark:text-neutral-100 font-medium"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
const links = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]
</script>
