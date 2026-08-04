import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FadedImage from '../../../app/components/ink/FadedImage.vue'

// NuxtImg is a Nuxt-injected global component, unavailable to plain @vue/test-utils;
// stub it as a passthrough <img> since this component uses no Nuxt-specific image props.
const NuxtImgStub = {
  inheritAttrs: false,
  template: '<img :src="$attrs.src" :alt="$attrs.alt" :class="$attrs.class">',
}

function mountFadedImage(props: Record<string, unknown>) {
  return mount(FadedImage, { props, global: { stubs: { NuxtImg: NuxtImgStub } } })
}

describe('fadedImage', () => {
  it('renders a NuxtImg with the given src and alt', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/images/sf-from-marin.png')
    expect(img.attributes('alt')).toBe('San Francisco Bay')
  })

  it('always applies rounded corners to the wrapper', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    expect(wrapper.classes()).toContain('rounded-xl')
  })

  it('renders no fade overlay by default', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay' })
    expect(wrapper.find('[style*="box-shadow"]').exists()).toBe(false)
  })

  it('renders an inset box-shadow overlay when faded is true', () => {
    const wrapper = mountFadedImage({ src: '/images/sf-from-marin.png', alt: 'San Francisco Bay', faded: true })
    const overlay = wrapper.find('[style*="box-shadow"]')
    expect(overlay.exists()).toBe(true)
    expect(overlay.attributes('style')).toContain('inset')
  })
})
