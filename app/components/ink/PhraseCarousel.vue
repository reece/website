<template>
  <span :aria-label="ariaLabel" role="text">
    <slot :item="currentItem" :mode="mode">
      <template v-if="currentItem">
        {{ currentItem.lead_in }} <TextTransition ref="textTransitionRef" :text="currentItem.phrase" :mode="mode" @done="scheduleNext" />
      </template>
    </slot>
  </span>
</template>

<script setup lang="ts">
/**
 * Rotates through a list of (lead-in, phrase) pairs, one at a time, using a
 * randomly (or sequentially) chosen transition each cycle. Only the phrase
 * animates via TextTransition; the lead-in renders plainly since it's static
 * within most cycles. Rendering can be fully overridden via the default slot.
 *
 * @example
 * <PhraseCarousel :items="[{ lead_in: 'I like...', phrase: 'building things that last' }]" />
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TextTransition, { TRANSITION_MODES, type TransitionMode } from './TextTransition.vue'

interface PhrasePair {
  lead_in: string
  phrase: string
}

const props = withDefaults(defineProps<{
  /** (lead-in, phrase) pairs to cycle through. */
  items: PhrasePair[]
  /** Pool of transition modes to choose from each cycle. Defaults to all available modes. */
  transitions?: TransitionMode[]
  /** How the next transition mode is chosen from the pool. */
  transitionOrder?: 'random' | 'sequential'
  /** How the next item is chosen from the list. */
  itemOrder?: 'random' | 'sequential'
  /** Milliseconds each item stays fully visible before the next transition starts. */
  intervalMs?: number
}>(), {
  transitions: () => [...TRANSITION_MODES],
  transitionOrder: 'random',
  itemOrder: 'random',
  intervalMs: 3000,
})

const index = ref(0)
const currentItem = ref<PhrasePair | undefined>(props.items[0])
const mode = ref<TransitionMode>(props.transitions[0] ?? 'fade')
const transitionCursor = ref(0)
const textTransitionRef = ref<InstanceType<typeof TextTransition>>()

const ariaLabel = computed(() => currentItem.value ? `${currentItem.value.lead_in} ${currentItem.value.phrase}` : undefined)

let timer: ReturnType<typeof setTimeout> | undefined

function nextIndex(): number {
  if (props.itemOrder === 'random' && props.items.length > 1) {
    let candidate = index.value
    while (candidate === index.value)
      candidate = Math.floor(Math.random() * props.items.length)
    return candidate
  }
  return (index.value + 1) % props.items.length
}

function nextTransition(): TransitionMode {
  const pool = props.transitions.length ? props.transitions : [...TRANSITION_MODES]
  if (props.transitionOrder === 'sequential') {
    const next = pool[transitionCursor.value % pool.length] ?? 'fade'
    transitionCursor.value += 1
    return next
  }
  return pool[Math.floor(Math.random() * pool.length)] ?? 'fade'
}

function scheduleNext() {
  timer = setTimeout(advance, props.intervalMs)
}

function advance() {
  if (props.items.length < 2) {
    scheduleNext()
    return
  }

  index.value = nextIndex()
  mode.value = nextTransition()
  currentItem.value = props.items[index.value]
}

onMounted(() => {
  scheduleNext()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})

defineExpose({
  /** Current phrase being displayed, for testing/inspection. */
  display: computed(() => textTransitionRef.value?.display ?? currentItem.value?.phrase ?? ''),
})
</script>
