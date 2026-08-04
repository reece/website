import { mount } from '@vue/test-utils'
import PhraseCarousel from '../../../app/components/ink/PhraseCarousel.vue'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

describe('phraseCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the first phrase initially', () => {
    const wrapper = mount(PhraseCarousel, {
      props: { phrases: ['building things that last', 'connecting with people'] },
    })
    expect(wrapper.text()).toContain('building things that last')
  })

  it('exposes an aria-label matching the current phrase for assistive tech', () => {
    const wrapper = mount(PhraseCarousel, {
      props: { phrases: ['building things that last'] },
    })
    expect(wrapper.attributes('aria-label')).toBe('building things that last')
  })

  it('advances to the next phrase after intervalMs plus transition time', async () => {
    const wrapper = mount(PhraseCarousel, {
      props: {
        phrases: ['building things that last', 'connecting with people'],
        transitions: ['fade'],
        intervalMs: 100,
      },
    })
    await vi.advanceTimersByTimeAsync(100 + 440)
    expect(wrapper.vm.display).toBe('connecting with people')
  })

  it.each(['fade', 'swipe-h', 'swipe-v', 'typing', 'scramble', 'morph'] as const)(
    'advances via the %s transition without throwing',
    async (mode) => {
      const wrapper = mount(PhraseCarousel, {
        props: {
          phrases: ['building things that last', 'connecting with people'],
          transitions: [mode],
          // Large interval so the second cycle's timer can't fire within the test's
          // time budget below — isolates "does one transition complete" from timing math.
          intervalMs: 100_000,
        },
      })
      await vi.advanceTimersByTimeAsync(100_000 + 3000)
      expect(wrapper.vm.display).toBe('connecting with people')
    },
  )

  it('swaps text instantly without animation classes when prefers-reduced-motion is set', async () => {
    mockMatchMedia(true)
    const wrapper = mount(PhraseCarousel, {
      props: {
        phrases: ['building things that last', 'connecting with people'],
        intervalMs: 50,
      },
    })
    await vi.advanceTimersByTimeAsync(50)
    expect(wrapper.vm.display).toBe('connecting with people')
    expect(wrapper.find('span[aria-hidden] span').exists()).toBe(false)
  })

  it('advances through phrases using the default transition pool with no explicit props', async () => {
    const wrapper = mount(PhraseCarousel, {
      props: { phrases: ['building things that last', 'connecting with people'], intervalMs: 100_000 },
    })
    // Budget covers the slowest possible mode (typing) since the mode is chosen at random;
    // intervalMs is large so a second cycle can't start within this window.
    await vi.advanceTimersByTimeAsync(100_000 + 3000)
    expect(wrapper.vm.display).toBe('connecting with people')
  })
})
