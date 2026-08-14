import { mount } from '@vue/test-utils'
import PhraseCarousel from '../../../app/components/ink/PhraseCarousel.vue'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

function pair(phrase: string, leadIn = 'I like...') {
  return { lead_in: leadIn, phrase }
}

describe('phraseCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first item initially', () => {
    const wrapper = mount(PhraseCarousel, {
      props: { items: [pair('building things that last'), pair('connecting with people')] },
    })
    expect(wrapper.text()).toContain('building things that last')
  })

  it('renders the lead-in alongside the phrase', () => {
    const wrapper = mount(PhraseCarousel, {
      props: { items: [pair('building things that last', 'I like...')] },
    })
    expect(wrapper.text()).toContain('I like...')
    expect(wrapper.text()).toContain('building things that last')
  })

  it('exposes an aria-label matching the current lead-in and phrase for assistive tech', () => {
    const wrapper = mount(PhraseCarousel, {
      props: { items: [pair('building things that last', 'I like...')] },
    })
    expect(wrapper.attributes('aria-label')).toBe('I like... building things that last')
  })

  it('advances to the next phrase after intervalMs plus transition time', async () => {
    const wrapper = mount(PhraseCarousel, {
      props: {
        items: [pair('building things that last'), pair('connecting with people')],
        transitions: ['fade'],
        intervalMs: 100,
      },
    })
    await vi.advanceTimersByTimeAsync(100 + 440)
    expect(wrapper.vm.display).toBe('connecting with people')
  })

  it.each([
    'fade',
    'swipe-left',
    'swipe-right',
    'swipe-up',
    'swipe-down',
    'typing',
    'scramble',
    'morph',
    'twist',
    'size-expand',
    'blur',
    'wave-rise',
    'ink-bleed',
  ] as const)(
    'advances via the %s transition without throwing',
    async (mode) => {
      const wrapper = mount(PhraseCarousel, {
        props: {
          items: [pair('building things that last'), pair('connecting with people')],
          transitions: [mode],
          // Large interval so the second cycle's timer can't fire within the test's
          // time budget below — isolates "does one transition complete" from timing math.
          intervalMs: 100_000,
        },
      })
      await vi.advanceTimersByTimeAsync(100_000 + 3500)
      expect(wrapper.vm.display).toBe('connecting with people')
    },
  )

  it('swaps text instantly without animation classes when prefers-reduced-motion is set', async () => {
    mockMatchMedia(true)
    const wrapper = mount(PhraseCarousel, {
      props: {
        items: [pair('building things that last'), pair('connecting with people')],
        intervalMs: 50,
      },
    })
    await vi.advanceTimersByTimeAsync(50)
    expect(wrapper.vm.display).toBe('connecting with people')
    expect(wrapper.find('span[aria-hidden] span').exists()).toBe(false)
  })

  it('advances through phrases using the default transition pool with no explicit props', async () => {
    const wrapper = mount(PhraseCarousel, {
      props: {
        items: [pair('building things that last'), pair('connecting with people')],
        intervalMs: 100_000,
      },
    })
    // Budget covers the slowest possible mode (typing) since the mode is chosen at random;
    // intervalMs is large so a second cycle can't start within this window.
    await vi.advanceTimersByTimeAsync(100_000 + 3000)
    expect(wrapper.vm.display).toBe('connecting with people')
  })

  it('walks items in list order when itemOrder is sequential', async () => {
    const items = [pair('one'), pair('two'), pair('three')]
    const wrapper = mount(PhraseCarousel, {
      props: { items, transitions: ['fade'], itemOrder: 'sequential', intervalMs: 50 },
    })
    const seen: string[] = [wrapper.vm.display]
    for (let i = 0; i < items.length + 1; i++) {
      await vi.advanceTimersByTimeAsync(50 + 440)
      seen.push(wrapper.vm.display)
    }
    expect(seen).toEqual(['one', 'two', 'three', 'one', 'two'])
  })

  it('never repeats the same phrase twice in a row when itemOrder is random (the default)', async () => {
    const items = [pair('one'), pair('two'), pair('three'), pair('four')]
    const wrapper = mount(PhraseCarousel, {
      props: { items, transitions: ['fade'], intervalMs: 50 },
    })
    const seen: string[] = [wrapper.vm.display]
    for (let i = 0; i < 20; i++) {
      await vi.advanceTimersByTimeAsync(50 + 440)
      seen.push(wrapper.vm.display)
    }
    for (let i = 1; i < seen.length; i++)
      expect(seen[i]).not.toBe(seen[i - 1])
  })
})
