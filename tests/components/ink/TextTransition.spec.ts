import { mount } from '@vue/test-utils'
import TextTransition, { TRANSITION_MODES } from '../../../app/components/ink/TextTransition.vue'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

describe('textTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the initial text', () => {
    const wrapper = mount(TextTransition, { props: { text: 'building things that last' } })
    expect(wrapper.text()).toContain('building things that last')
  })

  it('exposes an aria-label matching the current text', () => {
    const wrapper = mount(TextTransition, { props: { text: 'building things that last' } })
    expect(wrapper.attributes('aria-label')).toBe('building things that last')
  })

  it('animates to the new text when the text prop changes, and emits done', async () => {
    const wrapper = mount(TextTransition, { props: { text: 'one', mode: 'fade' } })
    await wrapper.setProps({ text: 'two' })
    await vi.advanceTimersByTimeAsync(440)
    expect(wrapper.vm.display).toBe('two')
    expect(wrapper.emitted('done')).toHaveLength(1)
  })

  it.each(TRANSITION_MODES)('completes the %s transition without throwing', async (mode) => {
    const wrapper = mount(TextTransition, { props: { text: 'one', mode } })
    await wrapper.setProps({ text: 'two' })
    await vi.advanceTimersByTimeAsync(3500)
    expect(wrapper.vm.display).toBe('two')
  })

  it('swaps text instantly without animation when prefers-reduced-motion is set', async () => {
    mockMatchMedia(true)
    const wrapper = mount(TextTransition, { props: { text: 'one' } })
    await wrapper.setProps({ text: 'two' })
    expect(wrapper.vm.display).toBe('two')
    expect(wrapper.find('span[aria-hidden] span').exists()).toBe(false)
  })

  it('does not re-animate when the text prop is set to the same value', async () => {
    const wrapper = mount(TextTransition, { props: { text: 'one' } })
    await wrapper.setProps({ text: 'one' })
    expect(wrapper.emitted('done')).toBeUndefined()
  })
})
