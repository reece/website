import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BrushStroke from '../../../app/components/ink/BrushStroke.vue'

describe('brushStroke', () => {
  it('renders an svg marked as decorative', () => {
    const wrapper = mount(BrushStroke)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the color prop to the fill', () => {
    const wrapper = mount(BrushStroke, { props: { color: '#6A7C6E' } })
    expect(wrapper.find('path').attributes('fill')).toBe('#6A7C6E')
  })

  it('applies a vertical flip transform when flip is true', () => {
    const wrapper = mount(BrushStroke, { props: { flip: true } })
    expect(wrapper.attributes('style')).toContain('scaleY(-1)')
  })

  it('does not flip by default', () => {
    const wrapper = mount(BrushStroke)
    expect(wrapper.attributes('style') ?? '').not.toContain('scaleY(-1)')
  })
})
