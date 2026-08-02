<template>
  <div>
    <h1 class="text-3xl font-bold tracking-tight mb-8">About</h1>
    <div class="prose-container">
      <ContentRenderer v-if="page" :value="page" />
      <div v-else class="text-neutral-600 dark:text-neutral-400">
        <p>Coming soon.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'About · Reece Hart' })

const { data: page } = await useAsyncData('about', () =>
  queryCollection('pages').path('/about').first(),
)
</script>
