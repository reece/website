import { defineConfig, presetIcons, presetTypography, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  shortcuts: {
    'link': 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors',
    'prose-container': 'prose prose-neutral dark:prose-invert max-w-none',
  },
})
