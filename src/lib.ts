import { useEffect } from 'react'

export const cached = <A extends unknown[], R>(fn: (...args: A) => R) => {
  const cache = new Map<string, R>()
  return (...args: A) => {
    const key = JSON.stringify(args)
    const maybeCached = cache.get(key)
    if (maybeCached !== undefined) {
      return maybeCached
    }
    const computed = fn(...args)
    cache.set(key, computed)
    return computed
  }
}

export const useThrottle = (
  action: () => void,
  delay: number,
  dependencies: unknown[],
) => {
  useEffect(() => {
    const handle = setTimeout(() => {
      action()
    }, delay)
    return () => {
      clearTimeout(handle)
    }
  }, [action, delay, ...dependencies])
}
