<template>
  <div>
    <section class="py-12">
      <h1 class="text-4xl font-bold tracking-tight mb-3">
        Reece Hart
      </h1>
      <p class="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
        Computational biologist · bioinformaticist · software engineer
      </p>
      <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
        I work at the intersection of genomics, structural biology, and software.
        This is where I write about things I'm building, thinking about, or have learned.
      </p>
      <div class="mt-8 flex gap-4">
        <NuxtLink to="/about" class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">
          About me →
        </NuxtLink>
        <NuxtLink to="/blog" class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">
          Read the blog →
        </NuxtLink>
      </div>
    </section>

    <section v-if="posts?.length" class="py-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 class="text-xl font-semibold mb-6">Recent posts</h2>
      <ul class="space-y-5">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs text-neutral-500 uppercase tracking-wide">{{ formatDate(post.date) }}</time>
            <h3 class="text-base font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {{ post.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/blog" class="inline-block mt-6 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors">
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
