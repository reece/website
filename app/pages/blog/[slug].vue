<template>
  <article v-if="post">
    <header class="mb-8">
      <time class="text-xs text-neutral-500 uppercase tracking-wide">{{ formatDate(post.date) }}</time>
      <h1 class="text-3xl font-bold tracking-tight mt-1 mb-3">{{ post.title }}</h1>
      <p v-if="post.description" class="text-neutral-600 dark:text-neutral-400">
        {{ post.description }}
      </p>
    </header>
    <div class="prose-container">
      <ContentRenderer :value="post" />
    </div>
  </article>
  <div v-else class="text-neutral-600 dark:text-neutral-400">
    Post not found.
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('blog').path(`/blog/${route.params.slug}`).first(),
)

if (post.value) {
  useSeoMeta({
    title: `${post.value.title} · Reece Hart`,
    description: post.value.description,
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
