<template>
  <div class="font-body text-ink">
    <h1 class="font-display text-3xl font-semibold tracking-tight mb-8">About</h1>

    <div class="grid sm:grid-cols-2 gap-8 items-center mb-12">
      <div class="prose-container">
        <ContentRenderer v-if="page" :value="page" />
        <p v-else class="opacity-60">Coming soon.</p>
      </div>
      <SketchPlaceholder label="Diagram: data, domain, and design intersecting" />
    </div>

    <section class="mb-12">
      <h2 class="font-display text-xl font-semibold mb-6">What I do</h2>
      <div class="grid sm:grid-cols-3 gap-6">
        <div v-for="item in whatIDo" :key="item.title">
          <h3 class="font-display font-medium mb-1">{{ item.title }}</h3>
          <p class="text-sm opacity-75">{{ item.body }}</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-display text-xl font-semibold mb-4">Contact</h2>
      <p class="text-sm opacity-75 mb-3">The best way to reach me is by email.</p>
      <ul class="space-y-2 text-sm">
        <li>
          Email: <a href="mailto:reece@reecehart.com" class="text-slate hover:opacity-75 transition-opacity">reece@reecehart.com</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/reece" target="_blank" rel="noopener noreferrer" class="text-slate hover:opacity-75 transition-opacity">github.com/reece</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'About · Reece Hart' })

const { data: page } = await useAsyncData('about', () =>
  queryCollection('pages').path('/pages/about').first(),
)

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: 'I dig into complex problems, make sense of the messy parts, and find the signal.' },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
