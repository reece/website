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
  theme: {
    colors: {
      paper: 'var(--paper)',
      linen: 'var(--linen)',
      sand: 'var(--sand)',
      ink: 'var(--ink)',
      slate: 'var(--slate)',
      forest: 'var(--forest)',
      rust: 'var(--rust)',
      gold: 'var(--gold)',

      background: 'var(--background)',
      foreground: 'var(--foreground)',
      border: 'var(--border)',
      primary: 'var(--primary)',
      headings: 'var(--headings)',
      accent: 'var(--accent)',
      secondary: 'var(--secondary)',
      subheadings: 'var(--subheadings)',
      highlight: 'var(--highlight)',
    },
    fontFamily: {
      display: '"Source Serif 4", Georgia, serif',
      body: '"Inter", system-ui, sans-serif',
      ad: '"Architects Daughter", cursive',
      chewy: '"Chewy", cursive',
      ph: '"Patrick Hand", cursive',
    },
  },
  shortcuts: {
    'link': 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors',
    'prose-container': 'prose prose-neutral dark:prose-invert max-w-none',
  },
})
