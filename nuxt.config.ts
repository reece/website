// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',

  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],

  // Static generation for GitHub Pages
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],
})
