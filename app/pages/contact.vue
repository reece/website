<template>
  <div>
    <h1 class="text-3xl font-bold tracking-tight mb-4">Contact</h1>
    <p class="text-neutral-600 dark:text-neutral-400 mb-8">
      The best way to reach me is by email.
    </p>
    <div class="prose-container">
      <ContentRenderer v-if="page" :value="page" />
      <ul v-else class="space-y-2 text-sm">
        <li>
          Email: <a href="mailto:reece@reecehart.com" class="link">reece@reecehart.com</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/reece" target="_blank" rel="noopener noreferrer" class="link">github.com/reece</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Contact · Reece Hart' })

const { data: page } = await useAsyncData('contact', () =>
  queryCollection('pages').path('/contact').first(),
)
</script>
