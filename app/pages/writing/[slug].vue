<template>
  <article v-if="post" class="font-body text-foreground">
    <header class="mb-8">
      <time class="text-xs uppercase tracking-wide opacity-50">{{ formatDate(post.date) }}</time>
      <h1 class="mt-1 mb-3">
        <MarkerUnderline color="var(--accent)">
          <span class="font-display text-3xl font-semibold tracking-tight">{{ post.title }}</span>
        </MarkerUnderline>
      </h1>
      <p v-if="post.description" class="opacity-75">
        {{ post.description }}
      </p>
    </header>

    <details v-if="toc.length" class="mb-8 md:hidden border border-border rounded p-3">
      <summary class="text-sm font-medium cursor-pointer">On this page</summary>
      <ul class="mt-2 space-y-1 text-sm">
        <li v-for="item in toc" :key="item.id">
          <a :href="`#${item.id}`" class="opacity-75 hover:opacity-100">{{ item.text }}</a>
        </li>
      </ul>
    </details>

    <div class="md:grid md:grid-cols-[minmax(0,1fr)_180px] md:gap-10">
      <div class="prose-container">
        <ContentRenderer :value="post" />
      </div>
      <nav v-if="toc.length" class="hidden md:block">
        <p class="text-xs uppercase tracking-wide opacity-50 mb-2">On this page</p>
        <ul class="space-y-2 text-sm sticky top-6">
          <li v-for="item in toc" :key="item.id">
            <a :href="`#${item.id}`" class="opacity-75 hover:opacity-100 hover:text-accent transition-colors">{{ item.text }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </article>
  <div v-else class="opacity-60">
    Post not found.
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`writing-${route.params.slug}`, () =>
  queryCollection('writing').path(`/writing/${route.params.slug}`).first(),
)

if (post.value) {
  useSeoMeta({
    title: `${post.value.title} · Reece Hart`,
    description: post.value.description,
  })
}

const toc = computed(() =>
  post.value?.body?.toc?.links?.map(link => ({ id: link.id, text: link.text })) ?? [],
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
