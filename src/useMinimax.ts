import { useThrottle } from './lib'
import { HeuristicCatalog } from './logic/heuristics'
import { minimaxABP } from './logic/minimax'
import type { GameState } from './logic/rules'
import {
  type Heuristic,
  type HeuristicWeights,
  useAgentState,
} from './useAgentState'
import { useGameState, useGameStateComputedAttrs } from './useGameState'

const useCompoundHeuristic = (
  agent: GameState['turn'],
  relaxed: boolean,
  weights: HeuristicWeights,
) => {
  return (gameState: Readonly<GameState>) => {
    let totalValue = 0
    for (const [heuristic, evaluation] of Object.entries(HeuristicCatalog)) {
      const weight = weights[heuristic as Heuristic]
      if (weight <= 0) {
        continue
      }
      totalValue += evaluation(agent, relaxed)(gameState)
    }
    return totalValue
  }
}

export const useMinimax = (agent: GameState['turn']) => {
  const { enabled, throttleTime, depth, heuristicWeights } =
    useAgentState(agent)

  const { move, relaxedMoves } = useGameState()
  const { state } = useGameStateComputedAttrs()

  const heuristic = useCompoundHeuristic(agent, relaxedMoves, heuristicWeights)

  const makeMove = () => {
    if (!enabled || state.turn !== agent) {
      return
    }
    let bestScore = -Infinity
    let bestMove: readonly [number, number, number, number] | null = null
    for (const move of state.getPossibleMoves(relaxedMoves)) {
      const outcome = state.move(...move, relaxedMoves)!
      const currentScore = minimaxABP({
        state: outcome,
        evaluate: heuristic,
        outcomes: state => state.getPossibleOutcomes(relaxedMoves),
        depth,
        maximizing: true,
      })
      if (currentScore > bestScore) {
        bestMove = move
        bestScore = currentScore
      }
    }
    if (bestMove !== null) {
      move(...bestMove)
    }
  }

  useThrottle(makeMove, throttleTime, [state])
}
