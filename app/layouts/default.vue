<template>
  <NuxtLayout name="plain">
    <AppNav />
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
