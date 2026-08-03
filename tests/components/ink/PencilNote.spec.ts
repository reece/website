import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PencilNote from '../../../app/components/ink/PencilNote.vue'

describe('pencilNote', () => {
  it('renders a decorative svg scribble', () => {
    const wrapper = mount(PencilNote)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop', () => {
    const wrapper = mount(PencilNote, { props: { color: '#52504A' } })
    expect(wrapper.find('path').attributes('stroke')).toBe('#52504A')
  })
})
