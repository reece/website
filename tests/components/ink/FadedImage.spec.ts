import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FadedImage from '../../../app/components/ink/FadedImage.vue'

// NuxtImg is a Nuxt-injected global component, unavailable to plain @vue/test-utils;
// stub it as a passthrough <img> since this component uses no Nuxt-specific image props.
const NuxtImgStub = {
  inheritAttrs: false,
  template: '<img :src="$attrs.src" :alt="$attrs.alt" :class="$attrs.class" :style="$attrs.style">',
}

function mountFadedImage(props: Record<string, unknown>) {
  return mount(FadedImage, { props, global: { stubs: { NuxtImg: NuxtImgStub } } })
}

describe('fadedImage', () => {
  it('renders a NuxtImg with the given src and alt', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    expect(wrapper.attributes('alt')).toBe('San Francisco Bay')
  })

  it('always applies rounded corners', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    expect(wrapper.classes()).toContain('rounded-xl')
  })

  it('applies no mask-image by default', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    expect(wrapper.attributes('style') ?? '').not.toContain('mask-image')
  })

  it('applies a radial-gradient mask when faded is true', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay', faded: true })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('mask-image')
    expect(style).toContain('-webkit-mask-image')
    expect(style).toContain('radial-gradient')
  })
})
