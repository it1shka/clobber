export type MinimaxProps<T> = {
  state: T
  evaluate: (state: T) => number
  outcomes: (state: T) => T[]
  depth: number
  maximizing: boolean
}

export const minimax = <T>(props: MinimaxProps<T>): number => {
  const { state, evaluate, outcomes, depth, maximizing } = props
  if (depth <= 0) {
    return evaluate(state)
  }
  const possibleOutcomes = outcomes(state)
  if (possibleOutcomes.length <= 0) {
    return evaluate(state)
  }
  const outcomesEvaluations = possibleOutcomes.map(outcome =>
    minimax({
      ...props,
      state: outcome,
      depth: depth - 1,
      maximizing: !maximizing,
    }),
  )
  const aggregation = maximizing ? Math.max : Math.min
  return aggregation(...outcomesEvaluations)
}

export type ABPMinimaxProps<T> = MinimaxProps<T> &
  Partial<{
    alpha: number
    beta: number
  }>

export const minimaxABP = <T>(props: ABPMinimaxProps<T>): number => {
  const {
    state,
    evaluate,
    outcomes,
    depth,
    maximizing,
    alpha = -Infinity,
    beta = Infinity,
  } = props
  if (depth <= 0) {
    return evaluate(state)
  }
  const possibleOutcomes = outcomes(state)
  if (possibleOutcomes.length <= 0) {
    return evaluate(state)
  }

  let runningAlpha = alpha
  let runningBeta = beta
  let score = maximizing ? -Infinity : Infinity
  const aggregate = maximizing ? Math.max : Math.min

  for (const outcome of possibleOutcomes) {
    const currentScore = minimaxABP({
      ...props,
      state: outcome,
      depth: depth - 1,
      maximizing: !maximizing,
      alpha: runningAlpha,
      beta: runningBeta,
    })
    score = aggregate(score, currentScore)
    if (maximizing) {
      if (score >= runningBeta) return score
      runningAlpha = Math.max(runningAlpha, score)
    } else {
      if (score <= runningAlpha) return score
      runningBeta = Math.min(runningBeta, score)
    }
  }

  return score
}
