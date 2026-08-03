import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ThinPenLine from '../../../app/components/ink/ThinPenLine.vue'

describe('thinPenLine', () => {
  it('renders a decorative svg rule', () => {
    const wrapper = mount(ThinPenLine)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop', () => {
    const wrapper = mount(ThinPenLine, { props: { color: '#6A7C6E' } })
    expect(wrapper.find('path').attributes('stroke')).toBe('#6A7C6E')
  })
})
