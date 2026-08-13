<template>
  <header class="relative">
    <MaskImage name="brushes/thick-box-taper-1" color="var(--primary)" height="clamp(76px, 20vw, 100px)" />
    <div class="absolute inset-0 flex flex-col justify-center pl-8 pr-6 text-background">
      <NuxtLink to="/" class="font-display text-xl sm:text-3xl font-semibold tracking-tight">
        Reece Hart, PhD
      </NuxtLink>
      <nav class="flex items-center">
        <ul class="flex items-center gap-5 text-sm font-body font-bold">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a :href="href" class="opacity-75 hover:opacity-100 transition-opacity" @click="navigate">
                <MarkerUnderline v-if="isActive" color="var(--background)">{{ link.label }}</MarkerUnderline>
                <span v-else>{{ link.label }}</span>
              </a>
            </NuxtLink>
          </li>
          <li>
            <button
              aria-label="Toggle dark mode"
              class="opacity-75 hover:opacity-100 transition-opacity"
              @click="toggleColorMode"
            >
              <span v-if="colorMode.value === 'dark'" class="i-ph-sun block">X</span>
              <span v-else class="i-ph-moon block">X</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * The brush's native aspect ratio doesn't leave enough height at narrow widths to fit
 * both the name and nav rows, so height is set directly (via clamp(), which aspect-ratio
 * doesn't support) instead of derived from width — shorter on wide screens, taller on
 * narrow ones, interpolating smoothly with viewport width instead of snapping at a breakpoint.
 */
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const links = [
  { label: 'About', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
]
</script>
