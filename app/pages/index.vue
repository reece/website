<template>
  <div class="font-body text-ink">

    <h2 class="font-display text-4xl font-semibold tracking-tight mb-3">
      Scientist. Engineer. Community Builder. Collaborator. Problem Solver. Curious Mind.
    </h2>

    <p v-if="enjoyPhrases?.length" class="font-body text-4xl mb-6">
      I...
      <PhraseCarousel :phrases="enjoyPhrases" class="text-highlight font-ad font-medium" />
    </p>

    <p class="font-body text-xl opacity-75 mb-6">
      I build systems and tools that turn complex data into understanding and ideas into impact.
    </p>

    <div class="prose-container">
      <ContentRenderer v-if="page" :value="page" />
      <p v-else class="opacity-60">Coming soon.</p>
    </div>

    <div class="rounded pointer-events-none" :style="{
      backgroundImage: 'url(/images/sf-from-marin.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: '0.2',
    }" />

    <section class="mb-12">
      <h2 class="font-display text-xl font-semibold mb-6">What I do</h2>
      <div class="grid sm:grid-cols-3 gap-6">
        <div v-for="item in whatIDo" :key="item.title">
          <h3 class="font-display font-medium mb-1">{{ item.title }}</h3>
          <p class="text-sm opacity-75">{{ item.body }}</p>
        </div>
      </div>
    </section>

    <InkRule variant="fine" color="var(--highlight)" class="mb-12" />

    <section>
      <h2 class="font-display text-xl font-semibold mb-4">Contact</h2>
      <p class="text-sm opacity-75 mb-3">The best way to reach me is by email.</p>
      <ul class="space-y-2 text-sm">
        <li>
          Email: <a href="mailto:reece@reecehart.com"
            class="text-slate hover:opacity-75 transition-opacity">reece@reecehart.com</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/reece" target="_blank" rel="noopener noreferrer"
            class="text-slate hover:opacity-75 transition-opacity">github.com/reece</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'plain' })

useSeoMeta({ title: 'About · Reece Hart' })

const { data: page } = await useAsyncData('about', () =>
  queryCollection('pages').path('/pages/about').first(),
)

const { data: enjoyPhrasesData } = await useAsyncData('enjoy-phrases', () =>
  queryCollection('enjoyPhrases').first(),
)
const enjoyPhrases = computed(() => enjoyPhrasesData.value?.phrases ?? [])

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: 'I dig into complex problems, make sense of the messy parts, and find the signal.' },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
