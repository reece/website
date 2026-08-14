<template>
  <div class="relative font-body text-foreground">
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.08]">
      <FadedImage src="/images/sf-from-marin.webp" alt="San Francisco Bay seen from Marin" position="75% 30%" />
    </div>

    <h2 class="font-display text-xl font-semibold tracking-tight mb-3">
      Engineering leader. Computational biologist. Civic do-gooder.
    </h2>

    <p v-if="phraseItems.length" class="font-ad font-medium text-2xl mb-6">
      <PhraseCarousel :items="phraseItems" v-slot="{ item, mode, onDone }">
        <span class="text-primary">{{ item?.lead_in }}</span> <TextTransition class="text-highlight" :text="item?.phrase ?? ''" :mode="mode" @done="onDone" />
      </PhraseCarousel>
    </p>

    <p>
      I am a scientist, engineering leader, and engaged citizen. I have a PhD in
      molecular biophysics, a master's degree in computer science, and over two
      decades of experience architecting, building, and operating reliable
      software systems for research, healthcare, and business. I enjoy solving
      complex problems, collaborating with smart people, and building products
      that matter. I am motivated by personal values and am currently exploring
      civic engagement projects that help people participate in the democratic
      process.
      <NuxtLink to="/about"
      class="text-accent hover:opacity-75 transition-opacity">More...</NuxtLink>
    </p>

    <section v-if="isDev && posts?.length" class="mt-8" :class="{ dev: isDev }">
      <h2 class="font-display text-xl font-semibold mb-6">Recent thoughts</h2>
      <ul class="space-y-5">
        <li v-for="(post, index) in posts" :key="post.path">
          <ThinPenLine v-if="index > 0" class="mb-5" />
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
            <h3 class="font-display text-base font-medium group-hover:text-accent transition-colors mt-0.5">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="font-body text-sm opacity-75 mt-1">
              {{ post.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/blog" class="inline-block mt-6 font-body text-sm text-accent hover:opacity-75 transition-opacity">
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
            class="text-accent hover:opacity-75 transition-opacity">reece@reecehart.com</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/reece" target="_blank" rel="noopener noreferrer"
            class="text-accent hover:opacity-75 transition-opacity">github.com/reece</a>
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

const { data: phraseCarouselData } = await useAsyncData('phrase-carousel', () =>
  queryCollection('phraseCarousel').first(),
)
const phraseItems = computed(() =>
  Object.values(phraseCarouselData.value?.phrases ?? {}).flatMap(section =>
    section.phrases.map(phrase => ({ lead_in: section.lead_in, phrase })),
  ),
)

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: 'I dig into complex problems, make sense of the messy parts, and find the signal.' },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
