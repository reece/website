<template>
  <span class="relative inline-grid items-baseline" :aria-label="currentPhrase" role="text">
    <slot :display="currentPhrase" :mode="mode">
      <TextTransition ref="textTransitionRef" :text="currentPhrase" :mode="mode" @done="scheduleNext" />
    </slot>
  </span>
</template>

<script setup lang="ts">
/**
 * Rotates through a list of short phrases, one at a time, using a randomly (or
 * sequentially) chosen transition each cycle. Rendering is delegated to
 * TextTransition, which owns the actual animation; this component only picks
 * which phrase and mode are current.
 *
 * @example
 * <PhraseCarousel :phrases="['building things that last', 'connecting with people']" />
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TextTransition, { TRANSITION_MODES, type TransitionMode } from './TextTransition.vue'

const props = withDefaults(defineProps<{
  /** Phrases to cycle through. */
  phrases: string[]
  /** Pool of transition modes to choose from each cycle. Defaults to all available modes. */
  transitions?: TransitionMode[]
  /** How the next transition mode is chosen from the pool. */
  transitionOrder?: 'random' | 'sequential'
  /** How the next phrase is chosen from the list. */
  phraseOrder?: 'random' | 'sequential'
  /** Milliseconds each phrase stays fully visible before the next transition starts. */
  intervalMs?: number
}>(), {
  transitions: () => [...TRANSITION_MODES],
  transitionOrder: 'random',
  phraseOrder: 'random',
  intervalMs: 3000,
})

const index = ref(0)
const currentPhrase = ref(props.phrases[0] ?? '')
const mode = ref<TransitionMode>(props.transitions[0] ?? 'fade')
const transitionCursor = ref(0)
const textTransitionRef = ref<InstanceType<typeof TextTransition>>()

let timer: ReturnType<typeof setTimeout> | undefined

function nextIndex(): number {
  if (props.phraseOrder === 'random' && props.phrases.length > 1) {
    let candidate = index.value
    while (candidate === index.value)
      candidate = Math.floor(Math.random() * props.phrases.length)
    return candidate
  }
  return (index.value + 1) % props.phrases.length
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
  if (props.phrases.length < 2) {
    scheduleNext()
    return
  }

  index.value = nextIndex()
  mode.value = nextTransition()
  currentPhrase.value = props.phrases[index.value] ?? ''
}

onMounted(() => {
  scheduleNext()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})

defineExpose({
  /** Current phrase being displayed, for testing/inspection. */
  display: computed(() => textTransitionRef.value?.display ?? currentPhrase.value),
})
</script>
