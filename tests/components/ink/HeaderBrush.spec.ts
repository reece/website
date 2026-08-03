import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderBrush from '../../../app/components/ink/HeaderBrush.vue'

describe('headerBrush', () => {
  it('renders an svg marked as decorative', () => {
    const wrapper = mount(HeaderBrush)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop', () => {
    const wrapper = mount(HeaderBrush, { props: { color: '#6A7C6E' } })
    expect(wrapper.attributes('style')).toContain('color: #6A7C6E')
  })

  it('defaults to the slate color', () => {
    const wrapper = mount(HeaderBrush)
    expect(wrapper.attributes('style')).toContain('color: var(--slate)')
  })
})
