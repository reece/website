<template>
  <header class="border-b border-neutral-200 dark:border-neutral-800">
    <nav class="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="font-semibold text-lg tracking-tight hover:text-blue-600 transition-colors">
        Reece Hart
      </NuxtLink>
      <div class="flex items-center gap-5">
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
        <button
          aria-label="Toggle dark mode"
          class="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          @click="toggleColorMode"
        >
          <span v-if="colorMode.value === 'dark'" class="i-ph-sun block" />
          <span v-else class="i-ph-moon block" />
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const links = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]
</script>
