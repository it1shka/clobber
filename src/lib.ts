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
