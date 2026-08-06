<template>
  <header class="bg-paper">
    <nav class="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="font-display text-lg font-semibold tracking-tight text-ink hover:text-slate transition-colors">
        Reece Hart
      </NuxtLink>
      <div class="flex items-center gap-5">
        <ul class="flex gap-5 text-sm font-body text-ink">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a :href="href" class="opacity-75 hover:opacity-100 transition-opacity" @click="navigate">
                <MarkerUnderline v-if="isActive" color="var(--slate)">{{ link.label }}</MarkerUnderline>
                <span v-else>{{ link.label }}</span>
              </a>
            </NuxtLink>
          </li>
        </ul>
        <button
          aria-label="Toggle dark mode"
          class="text-ink opacity-75 hover:opacity-100 transition-opacity"
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
  { label: 'About', to: '/' },
  { label: 'Blog', to: '/next/blog' },
  { label: 'Projects', to: '/next/projects' },
]
</script>
