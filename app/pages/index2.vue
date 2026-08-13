<template>
  <div>
    <section v-if="posts?.length" class="py-8">
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
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Reece Hart', description: 'Computational biologist, bioinformaticist, and software engineer.' })

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .limit(5)
    .all(),
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
