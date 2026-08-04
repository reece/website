<template>
  <span
    class="relative inline-grid items-baseline"
    :aria-label="phrases[index]"
    role="text"
  >
    <span aria-hidden="true" :class="displayClass">{{ display }}</span>
  </span>
</template>

<script setup lang="ts">
/**
 * Rotates through a list of short phrases, one at a time, using a randomly (or
 * sequentially) chosen transition each cycle. Respects prefers-reduced-motion by
 * swapping text instantly with no animation.
 *
 * @example
 * <PhraseCarousel :phrases="['building things that last', 'connecting with people']" />
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type TransitionMode = 'fade' | 'swipe-h' | 'swipe-v' | 'typing' | 'scramble' | 'morph'

const ALL_TRANSITIONS: TransitionMode[] = ['fade', 'swipe-h', 'swipe-v', 'typing', 'scramble', 'morph']
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz'

const props = withDefaults(defineProps<{
  /** Phrases to cycle through, in order for 'sequential', otherwise drawn randomly. */
  phrases: string[]
  /** Pool of transition modes to choose from each cycle. Defaults to all available modes. */
  transitions?: TransitionMode[]
  /** How the next transition mode is chosen from the pool. */
  order?: 'random' | 'sequential'
  /** Milliseconds each phrase stays fully visible before the next transition starts. */
  intervalMs?: number
}>(), {
  transitions: () => ['fade', 'swipe-h', 'swipe-v', 'typing', 'scramble', 'morph'],
  order: 'random',
  intervalMs: 3000,
})

const index = ref(0)
const display = ref(props.phrases[0] ?? '')
const displayClass = ref('')
const transitionCursor = ref(0)

let timer: ReturnType<typeof setTimeout> | undefined
let animationFrame: ReturnType<typeof setTimeout> | undefined
let reducedMotion = false

function nextIndex(): number {
  return (index.value + 1) % props.phrases.length
}

function nextTransition(): TransitionMode {
  const pool = props.transitions.length ? props.transitions : ALL_TRANSITIONS
  if (props.order === 'sequential') {
    const mode = pool[transitionCursor.value % pool.length]
    transitionCursor.value += 1
    return mode
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

function scheduleNext() {
  timer = setTimeout(advance, props.intervalMs)
}

function advance() {
  if (props.phrases.length < 2) {
    scheduleNext()
    return
  }

  const upcoming = nextIndex()
  const from = props.phrases[index.value]
  const to = props.phrases[upcoming]

  if (reducedMotion) {
    index.value = upcoming
    display.value = to
    scheduleNext()
    return
  }

  runTransition(nextTransition(), from, to, () => {
    index.value = upcoming
    scheduleNext()
  })
}

function runTransition(mode: TransitionMode, from: string, to: string, done: () => void) {
  displayClass.value = ''

  switch (mode) {
    case 'fade':
      return runFade(to, done)
    case 'swipe-h':
      return runSwipe('swipe-h', to, done)
    case 'swipe-v':
      return runSwipe('swipe-v', to, done)
    case 'typing':
      return runTyping(from, to, done)
    case 'scramble':
      return runScramble(to, done)
    case 'morph':
      return runMorph(from, to, done)
  }
}

function runFade(to: string, done: () => void) {
  displayClass.value = 'phrase-fade-out'
  animationFrame = setTimeout(() => {
    display.value = to
    displayClass.value = 'phrase-fade-in'
    animationFrame = setTimeout(done, 220)
  }, 220)
}

function runSwipe(mode: 'swipe-h' | 'swipe-v', to: string, done: () => void) {
  displayClass.value = `phrase-${mode}-out`
  animationFrame = setTimeout(() => {
    display.value = to
    displayClass.value = `phrase-${mode}-in`
    animationFrame = setTimeout(done, 260)
  }, 260)
}

function runTyping(from: string, to: string, done: () => void) {
  let pos = from.length

  function backspaceStep() {
    if (pos <= 0) {
      pos = 0
      display.value = ''
      typeStep()
      return
    }
    pos -= 1
    display.value = from.slice(0, pos)
    animationFrame = setTimeout(backspaceStep, 35)
  }

  function typeStep() {
    if (pos >= to.length) {
      done()
      return
    }
    pos += 1
    display.value = to.slice(0, pos)
    animationFrame = setTimeout(typeStep, 45)
  }

  backspaceStep()
}

function runScramble(to: string, done: () => void) {
  const steps = 8
  let step = 0

  function randomChar(target: string) {
    if (target === ' ')
      return ' '
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
  }

  function tick() {
    step += 1
    const revealCount = Math.floor((step / steps) * to.length)
    display.value = to
      .split('')
      .map((char, i) => (i < revealCount ? char : randomChar(char)))
      .join('')

    if (step >= steps) {
      display.value = to
      done()
      return
    }
    animationFrame = setTimeout(tick, 45)
  }

  tick()
}

function runMorph(from: string, to: string, done: () => void) {
  const steps = 10
  let step = 0
  const length = Math.max(from.length, to.length)

  function randomChar(target: string) {
    if (target === ' ')
      return ' '
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
  }

  function tick() {
    step += 1
    const progress = step / steps
    let next = ''
    for (let i = 0; i < length; i++) {
      const fromChar = from[i] ?? ''
      const toChar = to[i] ?? ''
      if (fromChar === toChar) {
        next += toChar
      }
      else if (progress >= 1) {
        next += toChar
      }
      else {
        next += randomChar(toChar || fromChar || ' ')
      }
    }
    display.value = next.trimEnd()

    if (step >= steps) {
      display.value = to
      done()
      return
    }
    animationFrame = setTimeout(tick, 45)
  }

  tick()
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scheduleNext()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(animationFrame)
})

defineExpose({
  /** Current phrase being displayed, for testing/inspection. */
  display: computed(() => display.value),
})
</script>

<style scoped>
span[aria-hidden] {
  display: inline-block;
  white-space: nowrap;
}

.phrase-fade-out {
  animation: phrase-fade-out 220ms ease-in forwards;
}

.phrase-fade-in {
  animation: phrase-fade-in 220ms ease-out forwards;
}

.phrase-swipe-h-out {
  animation: phrase-swipe-h-out 260ms ease-in forwards;
}

.phrase-swipe-h-in {
  animation: phrase-swipe-h-in 260ms ease-out forwards;
}

.phrase-swipe-v-out {
  animation: phrase-swipe-v-out 260ms ease-in forwards;
}

.phrase-swipe-v-in {
  animation: phrase-swipe-v-in 260ms ease-out forwards;
}

@keyframes phrase-fade-out {
  to { opacity: 0; }
}

@keyframes phrase-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes phrase-swipe-h-out {
  to { opacity: 0; transform: translateX(-0.75em); }
}

@keyframes phrase-swipe-h-in {
  from { opacity: 0; transform: translateX(0.75em); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes phrase-swipe-v-out {
  to { opacity: 0; transform: translateY(-0.6em); }
}

@keyframes phrase-swipe-v-in {
  from { opacity: 0; transform: translateY(0.6em); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .phrase-fade-out,
  .phrase-fade-in,
  .phrase-swipe-h-out,
  .phrase-swipe-h-in,
  .phrase-swipe-v-out,
  .phrase-swipe-v-in {
    animation: none;
  }
}
</style>
