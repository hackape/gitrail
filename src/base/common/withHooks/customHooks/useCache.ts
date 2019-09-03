import { useMemo } from '../hooks'

export function useCache<T = any, A extends any[] = any[]>(
  factory: () => T,
  deps: A
): T {
  const cache = useMemo(() => new Map(), [])
  const key = deps.map(dep => String(dep)).join('__$#!@__')
  if (cache.has(key)) {
    return cache.get(key)
  } else {
    const result = factory()
    cache.set(key, result)
    return result
  }
}
