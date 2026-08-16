// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      // Every page already composes its own full title (e.g. "Writing · Reece Hart"),
      // so skip the module's default "%s | site.name" template to avoid doubling it.
      titleTemplate: '%s',
    },
  },

  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  site: {
    url: 'https://reecehart.com',
    name: 'Reece Hart',
    description: 'Engineering leader. Computational biologist. Civic do-gooder.',
  },

  seo: {
    meta: {
      ogImage: 'https://reecehart.com/images/reece.webp',
    },
  },

  // Dynamic OG image generation not needed yet; using a static image site-wide.
  ogImage: {
    enabled: false,
  },

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
