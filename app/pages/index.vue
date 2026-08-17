<template>
  <div class="relative font-body text-foreground">
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.08]">
      <FadedImage src="/images/sf-from-marin.webp" alt="San Francisco Bay seen from Marin"
        position="75% 30%" />
    </div>

    <div class="w-32 mx-auto mb-4 md:w-40 md:float-right md:ml-6 md:mb-4">
      <FadedImage src="/images/reece.webp" alt="Reece Hart" />
    </div>

    <h2 class="font-display text-xl font-semibold tracking-tight mb-3">
      Engineering leader. Computational biologist. Civic do-gooder.
    </h2>

    <p v-if="phraseItems.length" class="font-ad font-medium text-2xl mb-6">
      <PhraseCarousel :items="phraseItems" :interval-ms=10000 v-slot="{ item, mode, onDone }">
        <span class="text-primary">{{ item?.lead_in }}</span>&nbsp;
        <TextTransition class="text-highlight" :text="item?.phrase ?? ''" :mode="mode"
          @done="onDone" />
      </PhraseCarousel>
    </p>

    <div v-if="page" class="relative font-body text-foreground">
      <ContentRenderer :value="page" />
    </div>

    <section v-if="isDev && posts?.length" class="mt-8" :class="{ dev: isDev }">
      <h2 class="font-display text-xl font-semibold mb-6">Recent thoughts</h2>
      <ul class="space-y-5">
        <li v-for="(post, index) in posts" :key="post.path">
          <ThinPenLine v-if="index > 0" class="mb-5" />
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date)
            }}</time>
            <h3
              class="font-display text-base font-medium group-hover:text-accent transition-colors mt-0.5">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="font-body text-sm opacity-75 mt-1">
              {{ post.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/writing"
        class="inline-block mt-6 font-body text-sm text-accent hover:opacity-75 transition-opacity">
        All posts →
      </NuxtLink>
    </section>

    <ThinPenLine name="lines/thin" color="var(--tertiary)" class="mb-6 mt-6 px-24" />

    <section>
      <ul class="flex flex-wrap items-center justify-center gap-5 text-2xl">
        <li v-for="link in socialLinks" :key="link.label">
          <span v-if="link.struckThrough" :title="link.label"
            class="relative grid place-items-center size-[1em] text-foreground opacity-75">
            <span :class="link.icon" class="col-start-1 row-start-1" />
            <span class="i-ph-prohibit-bold col-start-1 row-start-1 text-3xl text-rust" />
          </span>
          <a v-else-if="link.href" :href="link.href" :title="link.label"
            :target="link.href.startsWith('mailto:') ? undefined : '_blank'"
            :rel="link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
            class="block text-foreground opacity-75 hover:opacity-100 hover:text-accent transition-opacity">
            <span :class="link.icon" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

interface SocialLink {
  label: string
  icon: string
  href?: string
  struckThrough?: boolean
}

const socialLinks: SocialLink[] = [
  { label: 'Email', href: 'mailto:reece@reecehart.com', icon: 'i-ph-envelope' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/reece', icon: 'i-simple-icons-linkedin' },
  { label: 'GitHub', href: 'https://github.com/reece', icon: 'i-simple-icons-github' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/reece-hart.bsky.social', icon: 'i-simple-icons-bluesky' },
  { label: 'Signal', href: 'https://signal.me/#eu/reece.75', icon: 'i-simple-icons-signal' },
  // { label: 'Not on Twitter/X', icon: 'i-simple-icons-twitter', struckThrough: true },
  // { label: 'Not on Facebook', icon: 'i-simple-icons-facebook', struckThrough: true },
]

useSeoMeta({ title: 'Reece Hart' })

const isDev = import.meta.dev

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const { data: page } = await useAsyncData('index', () =>
  queryCollection('pages').path('/pages').first(),
)

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('writing')
    .order('date', 'DESC')
    .limit(5)
    .all(),
)

const { data: phraseCarouselData } = await useAsyncData('phrase-carousel', () =>
  queryCollection('phraseCarousel').first(),
)
const phraseItems = computed(() =>
  Object.entries(phraseCarouselData.value?.phrases ?? {}).flatMap(([lead_in, phrases]) =>
    phrases.map(phrase => ({ lead_in, phrase })),
  ),
)

const whatIDo = [
  { title: 'Build', body: 'I design and build software systems that are robust, maintainable, and actually used.' },
  { title: 'Understand', body: 'I dig into complex problems, make sense of the messy parts, and find the signal.' },
  { title: 'Collaborate', body: 'I work with smart people across disciplines to ship things that matter.' },
]
</script>
