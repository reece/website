import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const CSS = readFileSync(join(process.cwd(), 'app/assets/css/textures.css'), 'utf-8')

describe('textures.css', () => {
  const classNames = [
    'texture-paper-grain-light',
    'texture-paper-fiber',
    'texture-grain-overlay',
    'texture-graph-paper',
  ]

  it.each(classNames)('defines .%s with a background-image', (className) => {
    const ruleMatch = CSS.match(new RegExp(`\\.${className}\\s*\\{([\\s\\S]*?)\\}`))
    expect(ruleMatch, `.${className} not found in textures.css`).not.toBeNull()
    expect(ruleMatch![1]).toContain('background-image')
  })

  it.each(classNames)('does not set background-color on .%s (composes with the caller\'s surface color)', (className) => {
    const ruleMatch = CSS.match(new RegExp(`\\.${className}\\s*\\{([\\s\\S]*?)\\}`))
    expect(ruleMatch![1]).not.toContain('background-color')
  })

  it('exposes the graph-paper grid color as an overridable custom property, defaulting to --primary', () => {
    const ruleMatch = CSS.match(/\.texture-graph-paper\s*\{([\s\S]*?)\}/)
    expect(ruleMatch![1]).toContain('--texture-graph-color:')
    expect(ruleMatch![1]).toContain('var(--primary)')
    expect(ruleMatch![1]).toContain('var(--texture-graph-color)')
  })
})
