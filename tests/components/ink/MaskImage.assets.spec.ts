import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const COMPONENT_PATH = join(process.cwd(), 'app/components/ink/MaskImage.vue')
const ASSET_DIRS = ['brushes', 'lines'] as const

function actualSlugs(): string[] {
  return ASSET_DIRS.flatMap((dir) => {
    const dirPath = join(process.cwd(), 'app/assets', dir)
    return readdirSync(dirPath)
      .filter(file => file.endsWith('.webp'))
      .map(file => `${dir}/${file.replace(/\.webp$/, '')}`)
  }).sort()
}

function registeredSlugs(source: string, tableName: string): string[] {
  const tableMatch = source.match(new RegExp(`const ${tableName} = \\{([\\s\\S]*?)\\n\\} as const`))
  if (!tableMatch) throw new Error(`could not find ${tableName} table in MaskImage.vue`)
  const keyMatches = [...tableMatch[1].matchAll(/'([a-z0-9-]+\/[a-z0-9-]+)'/g)]
  return keyMatches.map(m => m[1]).sort()
}

describe('maskImage asset registration', () => {
  const source = readFileSync(COMPONENT_PATH, 'utf-8')
  const onDisk = actualSlugs()

  it('registers every asset on disk in IMAGE_URLS (nothing missing, nothing stale)', () => {
    expect(registeredSlugs(source, 'IMAGE_URLS')).toEqual(onDisk)
  })

  it('registers every asset on disk in IMAGE_ASPECT_RATIOS (nothing missing, nothing stale)', () => {
    expect(registeredSlugs(source, 'IMAGE_ASPECT_RATIOS')).toEqual(onDisk)
  })
})
