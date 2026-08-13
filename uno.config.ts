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
      slate: 'var(--slate-dark)',
      forest: 'var(--forest-dark)',
      rust: 'var(--rust-dark)',
      gold: 'var(--gold-dark)',

      background: 'var(--background)',
      foreground: 'var(--foreground)',
      border: 'var(--border)',
      primary: 'var(--primary)',
      headings: 'var(--headings)',
      accent: 'var(--accent)',
      secondary: 'var(--secondary)',
      subheadings: 'var(--subheadings)',
      tertiary: 'var(--tertiary)',
      highlight: 'var(--highlight)',
      neutral: 'var(--neutral)',
    },
    fontFamily: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
      ad: 'var(--font-ad)',
      chewy: 'var(--font-chewy)',
      ph: 'var(--font-ph)',
    },
  },
  shortcuts: {
    'link': 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors',
    'prose-container': 'prose prose-neutral dark:prose-invert max-w-none',
  },
})
