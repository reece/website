<template>
  <header class="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-2 bg-background">
    <NuxtLink to="/" class="relative shrink-0 block w-[260px] sm:w-[420px] h-[32px] sm:h-[52px]">
      <MaskImage name="brushes/thick-box-taper-1" color="var(--primary)" height="100%" />
      <span class="absolute inset-0 flex items-center justify-start pl-4 sm:pl-6 font-display text-sm sm:text-xl font-semibold tracking-tight text-background whitespace-nowrap">
        Reece Hart, PhD
      </span>
    </NuxtLink>

    <nav class="hidden md:flex items-center">
      <ul class="flex items-center gap-5 text-sm font-body font-bold">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a :href="href" class="text-foreground no-underline opacity-75 hover:opacity-100 transition-opacity" @click="navigate">
              <MarkerUnderline v-if="isActive" color="var(--foreground)">{{ link.label }}</MarkerUnderline>
              <span v-else>{{ link.label }}</span>
            </a>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <button
      class="md:hidden text-foreground"
      :aria-expanded="menuOpen"
      aria-label="Toggle menu"
      @click="menuOpen = !menuOpen"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line v-if="!menuOpen" x1="4" y1="6" x2="20" y2="6" />
        <line v-if="!menuOpen" x1="4" y1="12" x2="20" y2="12" />
        <line v-if="!menuOpen" x1="4" y1="18" x2="20" y2="18" />
        <line v-if="menuOpen" x1="5" y1="5" x2="19" y2="19" />
        <line v-if="menuOpen" x1="19" y1="5" x2="5" y2="19" />
      </svg>
    </button>

    <nav v-if="menuOpen" class="md:hidden absolute top-full inset-x-0 bg-background shadow-lg">
      <ul class="flex flex-col text-sm font-body font-bold">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a :href="href" class="block px-4 py-3 text-foreground no-underline opacity-75 hover:opacity-100 transition-opacity" @click="navigate(); menuOpen = false">
              <MarkerUnderline v-if="isActive" color="var(--foreground)">{{ link.label }}</MarkerUnderline>
              <span v-else>{{ link.label }}</span>
            </a>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuOpen = ref(false)

const links = [
  { label: 'About', to: '/about' },
  { label: 'Writing', to: '/writing', dev: true },
  { label: 'Projects', to: '/projects', dev: true },
].filter(link => !link.dev || import.meta.dev)
</script>
