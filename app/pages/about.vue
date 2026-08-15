<template>
  <div v-if="page" class="relative font-body text-foreground">
    <ContentRenderer :value="page" />
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('about', () =>
  queryCollection('pages').path('/pages/about').first(),
)

useSeoMeta({ title: page.value?.title ?? 'About · Reece Hart' })
</script>
