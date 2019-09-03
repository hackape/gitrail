import { _callstack, IBucket, getCurrentBucket, scopeTracker } from './internal'

function decorator<T extends Function>(fn: T): T {
  function wrapper() {
    scopeTracker.current = this
    _callstack.push(wrapper)
    const bucket = getCurrentBucket()
    // reset bucket index
    bucket.stateIdx = 0
    bucket.effectIdx = 0
    bucket.memoIdx = 0

    try {
      return fn.apply(this, arguments)
    } finally {
      try {
        runEffects(bucket)
      } finally {
        _callstack.pop()
        scopeTracker.reset()
      }
    }
  }

  function runEffects(bucket: IBucket) {
    for (let idx in bucket.effects) {
      const [effect] = bucket.effects[idx]
      try {
        if (typeof effect === 'function') {
          effect()
        }
      } finally {
        bucket.effects[idx][0] = undefined
      }
    }
  }

  return wrapper as any
}

export function reset(fn: Function) {
  _callstack.push(fn)
  const bucket = getCurrentBucket()
  try {
    for (const slot of bucket.effects) {
      const disposer = slot[2]
      if (typeof disposer === 'function') disposer()
    }
  } finally {
    _callstack.pop()
    bucket.delete()
  }
}

export function withHooks<T extends Function | Function[]>(fns: T): T
export function withHooks<T>(
  fns: any,
  methodName: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T>
export function withHooks(fns: any, methodName?: string, descriptor?: any) {
  if (typeof methodName === 'string' && descriptor) {
    descriptor.value = decorator(descriptor.value)
    return descriptor
  }

  if (typeof fns === 'function') {
    return decorator(fns)
  } else if (Array.isArray(fns)) {
    return fns.map(fn => {
      if (typeof fns === 'function') return decorator(fn)
      throw new Error('withHooks() takes function or array of function')
    }) as any
  } else {
    throw new Error('withHooks() takes function or array of function')
  }
}
