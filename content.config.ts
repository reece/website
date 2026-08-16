import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    writing: defineCollection({
      type: 'page',
      source: 'writing/**',
      schema: z.object({
        date: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/**',
    }),
    phraseCarousel: defineCollection({
      type: 'data',
      source: 'data/phrase-carousel.yml',
      schema: z.object({
        phrases: z.record(z.array(z.string())),
      }),
    }),
  },
})
