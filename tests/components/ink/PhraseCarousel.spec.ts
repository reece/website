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
          phrases: ['building things that last', 'connecting with people'],
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

  it('walks phrases in list order when phraseOrder is sequential', async () => {
    const phrases = ['one', 'two', 'three']
    const wrapper = mount(PhraseCarousel, {
      props: { phrases, transitions: ['fade'], phraseOrder: 'sequential', intervalMs: 50 },
    })
    const seen: string[] = [wrapper.vm.display]
    for (let i = 0; i < phrases.length + 1; i++) {
      await vi.advanceTimersByTimeAsync(50 + 440)
      seen.push(wrapper.vm.display)
    }
    expect(seen).toEqual(['one', 'two', 'three', 'one', 'two'])
  })

  it('never repeats the same phrase twice in a row when phraseOrder is random (the default)', async () => {
    const phrases = ['one', 'two', 'three', 'four']
    const wrapper = mount(PhraseCarousel, {
      props: { phrases, transitions: ['fade'], intervalMs: 50 },
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
