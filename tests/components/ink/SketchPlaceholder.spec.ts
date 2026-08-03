import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SketchPlaceholder from '../../../app/components/ink/SketchPlaceholder.vue'

describe('sketchPlaceholder', () => {
  it('renders an svg doodle', () => {
    const wrapper = mount(SketchPlaceholder)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('is not aria-hidden (it stands in for real content)', () => {
    const wrapper = mount(SketchPlaceholder)
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('renders a visually-hidden label when provided', () => {
    const wrapper = mount(SketchPlaceholder, { props: { label: 'Illustration: bridge sketch' } })
    expect(wrapper.text()).toContain('Illustration: bridge sketch')
  })
})
