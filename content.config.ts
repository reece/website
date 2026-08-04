import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
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
    enjoyPhrases: defineCollection({
      type: 'data',
      source: 'data/enjoy-phrases.yml',
      schema: z.object({
        phrases: z.array(z.string()),
      }),
    }),
  },
})
