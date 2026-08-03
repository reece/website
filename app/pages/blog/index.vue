<template>
  <div class="font-body text-ink">
    <h1 class="font-display text-3xl font-semibold tracking-tight mb-2">Writing</h1>
    <p class="text-sm opacity-75 mb-8">
      Notes, essays, and ideas on engineering, data, and making a positive impact.
    </p>

    <div v-if="tags.length" class="flex gap-4 overflow-x-auto pb-2 mb-8 text-sm font-medium">
      <button
        class="whitespace-nowrap transition-opacity"
        :class="activeTag === null ? 'opacity-100 text-slate' : 'opacity-60 hover:opacity-100'"
        @click="activeTag = null"
      >
        All
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        class="whitespace-nowrap transition-opacity"
        :class="activeTag === tag ? 'opacity-100 text-slate' : 'opacity-60 hover:opacity-100'"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <ul v-if="filteredPosts.length" class="space-y-8">
      <li v-for="(post, index) in filteredPosts" :key="post.path">
        <ThinPenLine v-if="index > 0" class="mb-8" />
        <NuxtLink :to="post.path" class="group block">
          <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
          <h2 class="font-display text-lg font-semibold group-hover:text-slate transition-colors mt-0.5">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="text-sm opacity-75 mt-1">
            {{ post.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="opacity-60">
      No posts{{ activeTag ? ` tagged "${activeTag}"` : '' }} yet.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Writing · Reece Hart', description: 'Writing on genomics, bioinformatics, and software.' })

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

const activeTag = ref<string | null>(null)

const tags = computed(() => {
  const all = (posts.value ?? []).flatMap(post => post.tags ?? [])
  return [...new Set(all)].sort()
})

const filteredPosts = computed(() => {
  if (!activeTag.value)
    return posts.value ?? []
  return (posts.value ?? []).filter(post => post.tags?.includes(activeTag.value!))
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
