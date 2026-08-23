import { execFileSync } from 'node:child_process'

function gitOutput(args: string[]) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim()
  }
  catch {
    return 'unknown'
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',

  runtimeConfig: {
    public: {
      buildInfo: {
        branch: gitOutput(['rev-parse', '--abbrev-ref', 'HEAD']),
        commit: gitOutput(['rev-parse', '--short', 'HEAD']),
        timestamp: new Date().toISOString(),
      },
    },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#FAF8F5', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0A0A0A', media: '(prefers-color-scheme: dark)' },
      ],
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
    name: 'Reece Hart • Engineering Leader & Computational Biologist',
    description: 'Startup veteran and engineering leader in healthcare and civic causes',
  },

  seo: {
    meta: {
      ogImage: 'https://reecehart.com/images/ogimage.webp',
      ogImageAlt: 'Watercolor illustration of the Golden Gate Bridge and San Francisco skyline with Reece Hart, PhD branding.',
      ogImageType: 'image/webp',
      ogImageWidth: 1730,
      ogImageHeight: 909,
      ogLocale: 'en_US',
      twitterCard: 'summary_large_image',
      twitterImage: 'https://reecehart.com/images/ogimage.webp',
      twitterImageAlt: 'Watercolor illustration of the Golden Gate Bridge and San Francisco skyline with Reece Hart, PhD branding.',
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
