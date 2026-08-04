import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BrushImage from '../../../app/components/ink/BrushImage.vue'

describe('brushImage', () => {
  it('renders a div marked as decorative', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('presentation')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('sets a mask-image for each valid brush name', () => {
    const names = ['brush1', 'brush2', 'brush3', 'brush4'] as const
    for (const name of names) {
      const wrapper = mount(BrushImage, { props: { name } })
      const style = wrapper.attributes('style') ?? ''
      expect(style).toContain('mask-image')
      expect(style).toContain('-webkit-mask-image')
    }
  })

  it('defaults background-color to currentColor', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    const style = (wrapper.attributes('style') ?? '').toLowerCase()
    expect(style).toContain('background-color: currentcolor')
  })

  it('applies the color prop as background-color', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', color: '#6A7C6E' } })
    expect(wrapper.attributes('style')).toContain('background-color: #6A7C6E')
  })

  it('applies no transform by default', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.attributes('style') ?? '').not.toContain('transform')
  })

  it('applies scaleX(-1) when flip is horizontal', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'horizontal' } })
    expect(wrapper.attributes('style')).toContain('transform: scaleX(-1)')
  })

  it('applies scaleY(-1) when flip is vertical', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'vertical' } })
    expect(wrapper.attributes('style')).toContain('transform: scaleY(-1)')
  })

  it('applies scale(-1, -1) when flip is both', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', flip: 'both' } })
    expect(wrapper.attributes('style')).toContain('transform: scale(-1, -1)')
  })

  it('uses the natural aspect ratio by default', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1' } })
    expect(wrapper.attributes('style')).toContain(`aspect-ratio: ${1585 / 193}`)
  })

  it('halves the derived height when heightScale is 0.5', () => {
    const wrapper = mount(BrushImage, { props: { name: 'brush1', heightScale: 0.5 } })
    expect(wrapper.attributes('style')).toContain(`aspect-ratio: ${(1585 / 193) / 0.5}`)
  })
})
