<template>
  <span
    class="relative inline-grid items-baseline"
    :aria-label="phrases[index]"
    role="text"
  >
    <svg width="0" height="0" class="absolute" aria-hidden="true">
      <defs>
        <filter :id="inkBleedId" x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.15" numOctaves="2" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" :scale="inkBleedScale" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <span v-if="!useLetters" aria-hidden="true" :class="displayClass" :style="displayStyle">{{ display }}</span>
    <span v-else aria-hidden="true" class="inline-block whitespace-nowrap">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        class="inline-block"
        :style="letter.style"
      >{{ letter.char === ' ' ? ' ' : letter.char }}</span>
    </span>
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
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

type TransitionMode =
  | 'fade'
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'typing'
  | 'scramble'
  | 'morph'
  | 'twist'
  | 'size-expand'
  | 'blur'
  | 'wave-rise'
  | 'ink-bleed'

interface Letter {
  char: string
  style: Record<string, string>
}

const ALL_TRANSITIONS: TransitionMode[] = [
  'fade',
  'swipe-left',
  'swipe-right',
  'swipe-up',
  'swipe-down',
  'typing',
  'scramble',
  'morph',
  'twist',
  'size-expand',
  'blur',
  'wave-rise',
  'ink-bleed',
]
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const LETTER_MODES = new Set<TransitionMode>(['twist', 'wave-rise'])

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
  transitions: () => [
    'fade',
    'swipe-left',
    'swipe-right',
    'swipe-up',
    'swipe-down',
    'typing',
    'scramble',
    'morph',
    'twist',
    'size-expand',
    'blur',
    'wave-rise',
    'ink-bleed',
  ],
  transitionOrder: 'random',
  phraseOrder: 'random',
  intervalMs: 3000,
})

const index = ref(0)
const display = ref(props.phrases[0] ?? '')
const displayClass = ref('')
const displayStyle = ref<Record<string, string>>({})
const transitionCursor = ref(0)
const useLetters = ref(false)
const letters = ref<Letter[]>([])
const inkBleedScale = ref(0)

const instanceId = useId()
const inkBleedId = `phrase-ink-bleed-${instanceId}`

let timer: ReturnType<typeof setTimeout> | undefined
let reducedMotion = false
const pendingFrames = new Set<ReturnType<typeof setTimeout>>()

function scheduleFrame(fn: () => void, delayMs: number) {
  const id = setTimeout(() => {
    pendingFrames.delete(id)
    fn()
  }, delayMs)
  pendingFrames.add(id)
}

function clearPendingFrames() {
  pendingFrames.forEach(id => clearTimeout(id))
  pendingFrames.clear()
}

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
  const pool = props.transitions.length ? props.transitions : ALL_TRANSITIONS
  if (props.transitionOrder === 'sequential') {
    const mode = pool[transitionCursor.value % pool.length] ?? 'fade'
    transitionCursor.value += 1
    return mode
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

  const upcoming = nextIndex()
  const from = props.phrases[index.value] ?? ''
  const to = props.phrases[upcoming] ?? ''

  if (reducedMotion) {
    index.value = upcoming
    display.value = to
    useLetters.value = false
    scheduleNext()
    return
  }

  const mode = nextTransition()
  useLetters.value = LETTER_MODES.has(mode)

  runTransition(mode, from, to, () => {
    index.value = upcoming
    scheduleNext()
  })
}

function runTransition(mode: TransitionMode, from: string, to: string, done: () => void) {
  displayClass.value = ''
  displayStyle.value = {}

  switch (mode) {
    case 'fade':
      return runFade(to, done)
    case 'swipe-left':
    case 'swipe-right':
    case 'swipe-up':
    case 'swipe-down':
      return runSwipe(mode, to, done)
    case 'typing':
      return runTyping(from, to, done)
    case 'scramble':
      return runScramble(to, done)
    case 'morph':
      return runMorph(from, to, done)
    case 'size-expand':
      return runSizeExpand(to, done)
    case 'blur':
      return runBlur(to, done)
    case 'twist':
      return runTwist(from, to, done)
    case 'wave-rise':
      return runWaveRise(from, to, done)
    case 'ink-bleed':
      return runInkBleed(to, done)
  }
}

function runFade(to: string, done: () => void) {
  displayClass.value = 'phrase-fade-out'
  scheduleFrame(() => {
    display.value = to
    displayClass.value = 'phrase-fade-in'
    scheduleFrame(done, 220)
  }, 220)
}

function runSwipe(mode: 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down', to: string, done: () => void) {
  displayClass.value = `phrase-${mode}-out`
  scheduleFrame(() => {
    display.value = to
    displayClass.value = `phrase-${mode}-in`
    scheduleFrame(done, 260)
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
    scheduleFrame(backspaceStep, 35)
  }

  function typeStep() {
    if (pos >= to.length) {
      done()
      return
    }
    pos += 1
    display.value = to.slice(0, pos)
    scheduleFrame(typeStep, 45)
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
    scheduleFrame(tick, 45)
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
    scheduleFrame(tick, 45)
  }

  tick()
}

function runSizeExpand(to: string, done: () => void) {
  displayClass.value = 'phrase-size-out'
  scheduleFrame(() => {
    display.value = to
    displayClass.value = 'phrase-size-in'
    scheduleFrame(done, 260)
  }, 260)
}

function runBlur(to: string, done: () => void) {
  displayClass.value = 'phrase-blur-out'
  scheduleFrame(() => {
    display.value = to
    displayClass.value = 'phrase-blur-in'
    scheduleFrame(done, 220)
  }, 220)
}

function runInkBleed(to: string, done: () => void) {
  displayStyle.value = { filter: `url(#${inkBleedId})` }
  const outSteps = 6
  const inSteps = 6
  const peakScale = 30
  let step = 0

  function outTick() {
    step += 1
    inkBleedScale.value = (step / outSteps) * peakScale
    displayClass.value = 'phrase-ink-out'
    if (step >= outSteps) {
      display.value = to
      step = 0
      scheduleFrame(inTick, 40)
      return
    }
    scheduleFrame(outTick, 40)
  }

  function inTick() {
    step += 1
    inkBleedScale.value = peakScale - (step / inSteps) * peakScale
    displayClass.value = 'phrase-ink-in'
    if (step >= inSteps) {
      inkBleedScale.value = 0
      displayStyle.value = {}
      done()
      return
    }
    scheduleFrame(inTick, 40)
  }

  outTick()
}

function buildLetters(chars: string[], styler: (i: number, total: number) => Record<string, string>): Letter[] {
  return chars.map((char, i) => ({ char, style: styler(i, chars.length) }))
}

function runTwist(from: string, to: string, done: () => void) {
  const length = Math.max(from.length, to.length)
  const staggerMs = 30
  const flipMs = 260
  const totalMs = length * staggerMs + flipMs

  letters.value = buildLetters(Array.from({ length }, (_, i) => from[i] ?? ''), (i) => ({
    'transition': `transform ${flipMs}ms ease-in, opacity ${flipMs}ms ease-in`,
    'transition-delay': `${i * staggerMs}ms`,
    'transform-style': 'preserve-3d',
    'transform': 'rotateX(0deg)',
    'opacity': from[i] === undefined ? '0' : '1',
  }))

  scheduleFrame(() => {
    letters.value = letters.value.map((letter, i) => ({
      ...letter,
      style: { ...letter.style, transform: 'rotateX(90deg)', opacity: from[i] === undefined ? '0' : (to[i] === undefined ? '0' : '1') },
    }))
  }, 10)

  scheduleFrame(() => {
    letters.value = buildLetters(Array.from({ length }, (_, i) => to[i] ?? ''), (i) => ({
      'transition': `transform ${flipMs}ms ease-out, opacity ${flipMs}ms ease-out`,
      'transition-delay': `${i * staggerMs}ms`,
      'transform-style': 'preserve-3d',
      'transform': 'rotateX(-90deg)',
      'opacity': to[i] === undefined ? '0' : '1',
    }))

    scheduleFrame(() => {
      letters.value = letters.value.map(letter => ({
        ...letter,
        style: { ...letter.style, transform: 'rotateX(0deg)', opacity: '1' },
      }))
    }, 10)

    scheduleFrame(() => {
      display.value = to
      useLetters.value = false
      done()
    }, flipMs + length * staggerMs)
  }, totalMs / 2)
}

function runWaveRise(from: string, to: string, done: () => void) {
  const length = Math.max(from.length, to.length)
  const staggerMs = 25
  const riseMs = 220

  letters.value = buildLetters(Array.from({ length }, (_, i) => from[i] ?? ''), (i) => ({
    'transition': `transform ${riseMs}ms ease-in, opacity ${riseMs}ms ease-in`,
    'transition-delay': `${i * staggerMs}ms`,
    'transform': 'translateY(0)',
    'opacity': from[i] === undefined ? '0' : '1',
  }))

  scheduleFrame(() => {
    letters.value = letters.value.map(letter => ({
      ...letter,
      style: { ...letter.style, transform: 'translateY(-0.6em)', opacity: '0' },
    }))
  }, 10)

  scheduleFrame(() => {
    letters.value = buildLetters(Array.from({ length }, (_, i) => to[i] ?? ''), (i) => ({
      'transition': `transform ${riseMs}ms ease-out, opacity ${riseMs}ms ease-out`,
      'transition-delay': `${i * staggerMs}ms`,
      'transform': 'translateY(0.6em)',
      'opacity': '0',
    }))

    scheduleFrame(() => {
      letters.value = letters.value.map(letter => ({
        ...letter,
        style: { ...letter.style, transform: 'translateY(0)', opacity: '1' },
      }))
    }, 10)

    scheduleFrame(() => {
      display.value = to
      useLetters.value = false
      done()
    }, riseMs + length * staggerMs)
  }, riseMs + length * staggerMs + 10)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scheduleNext()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearPendingFrames()
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

.phrase-swipe-left-out {
  animation: phrase-swipe-left-out 260ms ease-in forwards;
}

.phrase-swipe-left-in {
  animation: phrase-swipe-left-in 260ms ease-out forwards;
}

.phrase-swipe-right-out {
  animation: phrase-swipe-right-out 260ms ease-in forwards;
}

.phrase-swipe-right-in {
  animation: phrase-swipe-right-in 260ms ease-out forwards;
}

.phrase-swipe-up-out {
  animation: phrase-swipe-up-out 260ms ease-in forwards;
}

.phrase-swipe-up-in {
  animation: phrase-swipe-up-in 260ms ease-out forwards;
}

.phrase-swipe-down-out {
  animation: phrase-swipe-down-out 260ms ease-in forwards;
}

.phrase-swipe-down-in {
  animation: phrase-swipe-down-in 260ms ease-out forwards;
}

.phrase-size-out {
  animation: phrase-size-out 260ms ease-in forwards;
}

.phrase-size-in {
  animation: phrase-size-in 260ms ease-out forwards;
}

.phrase-blur-out {
  animation: phrase-blur-out 220ms ease-in forwards;
}

.phrase-blur-in {
  animation: phrase-blur-in 220ms ease-out forwards;
}

.phrase-ink-out {
  animation: phrase-ink-out 240ms ease-in forwards;
}

.phrase-ink-in {
  animation: phrase-ink-in 240ms ease-out forwards;
}

@keyframes phrase-fade-out {
  to { opacity: 0; }
}

@keyframes phrase-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes phrase-swipe-left-out {
  to { opacity: 0; transform: translateX(-0.75em); }
}

@keyframes phrase-swipe-left-in {
  from { opacity: 0; transform: translateX(0.75em); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes phrase-swipe-right-out {
  to { opacity: 0; transform: translateX(0.75em); }
}

@keyframes phrase-swipe-right-in {
  from { opacity: 0; transform: translateX(-0.75em); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes phrase-swipe-up-out {
  to { opacity: 0; transform: translateY(-0.6em); }
}

@keyframes phrase-swipe-up-in {
  from { opacity: 0; transform: translateY(0.6em); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes phrase-swipe-down-out {
  to { opacity: 0; transform: translateY(0.6em); }
}

@keyframes phrase-swipe-down-in {
  from { opacity: 0; transform: translateY(-0.6em); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes phrase-size-out {
  to { opacity: 0; transform: scale(0.1); }
}

@keyframes phrase-size-in {
  from { opacity: 0; transform: scale(0.1); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes phrase-blur-out {
  to { opacity: 0.15; filter: blur(6px); }
}

@keyframes phrase-blur-in {
  from { opacity: 0.15; filter: blur(6px); }
  to { opacity: 1; filter: blur(0); }
}

@keyframes phrase-ink-out {
  to { opacity: 0.2; }
}

@keyframes phrase-ink-in {
  from { opacity: 0.2; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .phrase-fade-out,
  .phrase-fade-in,
  .phrase-swipe-left-out,
  .phrase-swipe-left-in,
  .phrase-swipe-right-out,
  .phrase-swipe-right-in,
  .phrase-swipe-up-out,
  .phrase-swipe-up-in,
  .phrase-swipe-down-out,
  .phrase-swipe-down-in,
  .phrase-size-out,
  .phrase-size-in,
  .phrase-blur-out,
  .phrase-blur-in,
  .phrase-ink-out,
  .phrase-ink-in {
    animation: none;
  }
}
</style>
