<template>
  <div class="relative font-body text-ink">
    <div class="fixed inset-0 z-0 pointer-events-none opacity-10">
      <FadedImage src="/images/sf-from-marin.webp" alt="San Francisco Bay seen from Marin" />
    </div>

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

    <section class="mb-12">
      <h2 class="font-display text-xl font-semibold mb-6">What I do</h2>
      <div class="grid sm:grid-cols-3 gap-6">
        <div v-for="item in whatIDo" :key="item.title">
          <h3 class="font-display font-medium mb-1">{{ item.title }}</h3>
          <p class="text-sm opacity-75">{{ item.body }}</p>
        </div>
      </div>
    </section>


    <section v-if="isDev && posts?.length" class="py-8" :class="{ dev: isDev }">
      <h2 class="font-display text-xl font-semibold mb-6">Recent thoughts</h2>
      <ul class="space-y-5">
        <li v-for="(post, index) in posts" :key="post.path">
          <ThinPenLine v-if="index > 0" class="mb-5" />
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
            <h3 class="font-display text-base font-medium group-hover:text-slate transition-colors mt-0.5">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="font-body text-sm opacity-75 mt-1">
              {{ post.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/blog" class="inline-block mt-6 font-body text-sm text-slate hover:opacity-75 transition-opacity">
        All posts →
      </NuxtLink>
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
definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'About · Reece Hart' })

const isDev = import.meta.dev

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .limit(5)
    .all(),
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
