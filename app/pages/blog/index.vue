<template>
  <div>
    <h1 class="text-3xl font-bold tracking-tight mb-8">Blog</h1>
    <ul v-if="posts?.length" class="space-y-8">
      <li v-for="post in posts" :key="post.path" class="group">
        <NuxtLink :to="post.path" class="block">
          <time class="text-xs text-neutral-500 uppercase tracking-wide">{{ formatDate(post.date) }}</time>
          <h2 class="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {{ post.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="text-neutral-600 dark:text-neutral-400">
      No posts yet. Check back soon.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Blog · Reece Hart', description: 'Writing on genomics, bioinformatics, and software.' })

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
