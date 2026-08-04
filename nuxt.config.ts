// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',

  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image',
  ],

  colorMode: {
    classSuffix: '',
  },

  components: [
    { path: '~/components/ink', pathPrefix: false },
    { path: '~/components/md-aliases', pathPrefix: false },
    '~/components',
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
    '~/assets/css/theme.css',
    '~/assets/css/textures.css',
  ],
})
