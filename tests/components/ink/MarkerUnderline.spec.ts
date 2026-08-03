import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkerUnderline from '../../../app/components/ink/MarkerUnderline.vue'

describe('markerUnderline', () => {
  it('renders slotted content', () => {
    const wrapper = mount(MarkerUnderline, {
      slots: { default: 'About' },
    })
    expect(wrapper.text()).toContain('About')
  })

  it('renders a decorative svg underline alongside the slot content', () => {
    const wrapper = mount(MarkerUnderline, { slots: { default: 'About' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies the color prop', () => {
    const wrapper = mount(MarkerUnderline, {
      props: { color: '#365C7A' },
      slots: { default: 'About' },
    })
    expect(wrapper.find('path').attributes('stroke')).toBe('#365C7A')
  })
})
