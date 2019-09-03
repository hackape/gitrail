type EffectCallback = () => void | EffectDisposer
type EffectDeps = any[]
type EffectDisposer = () => void
export type IBucket = {
  states: any[]
  effects: [EffectCallback?, EffectDeps?, EffectDisposer?][]
  memos: any[]
  stateIdx: number
  effectIdx: number
  memoIdx: number
  delete(): void
}

export const _callstack = []

function isPrimitive(arg: any) {
  const type = typeof arg
  return arg == null || (type != 'object' && type != 'function')
}

export const scopeTracker = {
  current: globalThis,
  reset() {
    this.current = globalThis
  }
}

const symbol = '__FN_WITH_HOOKS_DO_NOT_TOUCH__'
function getCurrentBuckets(ref: any): WeakMap<object, IBucket> {
  if (isPrimitive(ref)) ref = globalThis
  const buckets = ref[symbol] || (ref[symbol] = new WeakMap<object, IBucket>())
  return buckets
}

export function getCurrentBucket(callerName = 'Hooks') {
  if (!_callstack.length) {
    throw new Error(
      '`' +
        callerName +
        '` only valid inside a function decorated with `withHooks()` or a custom hook.'
    )
  }
  const currentFn = _callstack[_callstack.length - 1]
  const buckets = getCurrentBuckets(scopeTracker.current)
  if (!buckets.has(currentFn)) {
    const bucket: IBucket = {
      states: [],
      effects: [],
      memos: [],
      stateIdx: 0,
      effectIdx: 0,
      memoIdx: 0,
      delete() {
        buckets.delete(currentFn)
      }
    }
    buckets.set(currentFn, bucket)
  }

  return buckets.get(currentFn)
}
