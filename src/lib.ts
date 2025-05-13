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
  dependencies: unknown,
) => {
  useEffect(() => {
    const handle = setTimeout(() => {
      action()
    }, delay)
    return () => {
      clearTimeout(handle)
    }
  }, [action, delay, dependencies])
}

export const shuffled = <T>(array: T[]) => {
  return array
    .map(value => [value, Math.random()] as const)
    .sort(([_, sortA], [__, sortB]) => sortA - sortB)
    .map(([value, _]) => value)
}

export const findBest = <T>(
  array: T[],
  evaluation: (item: T) => number,
  shuffle = false,
) => {
  if (array.length <= 0) {
    return null
  }
  return (shuffle ? shuffled(array) : array)
    .map(item => [item, evaluation(item)] as const)
    .reduce((acc, elem) => {
      const [_, bestScore] = acc
      const [__, currentScore] = elem
      if (currentScore > bestScore) {
        return elem
      }
      return acc
    })[0]
}
