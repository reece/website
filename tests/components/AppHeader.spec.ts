import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../app/components/AppHeader.vue'

const NuxtLinkStub = {
  props: { to: String, custom: { type: Boolean, default: false } },
  template: `<a v-if="!custom" :href="to"><slot /></a>
    <slot v-else :href="to" :navigate="() => {}" :isActive="false" />`,
}

function mountHeader() {
  return mount(AppHeader, {
    global: {
      stubs: { NuxtLink: NuxtLinkStub, MaskImage: true, MarkerUnderline: true },
    },
  })
}

describe('appHeader', () => {
  it('links the logo to the home page', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('a[href="/"]').exists()).toBe(true)
  })

  it('does not render a separate home nav link', () => {
    const wrapper = mountHeader()
    expect(wrapper.text()).not.toContain('🏠')
  })

  it('hides the mobile menu panel until the toggle button is clicked', async () => {
    const wrapper = mountHeader()
    expect(wrapper.find('[aria-expanded="true"]').exists()).toBe(false)

    await wrapper.find('button[aria-label="Toggle menu"]').trigger('click')
    expect(wrapper.find('[aria-expanded="true"]').exists()).toBe(true)
    expect(wrapper.findAll('a[href="/about"]').length).toBeGreaterThan(0)
  })

  it('closes the mobile menu when a link is clicked', async () => {
    const wrapper = mountHeader()
    await wrapper.find('button[aria-label="Toggle menu"]').trigger('click')

    const links = wrapper.findAll('a[href="/about"]')
    await links[links.length - 1]!.trigger('click')

    expect(wrapper.find('[aria-expanded="true"]').exists()).toBe(false)
  })
})
