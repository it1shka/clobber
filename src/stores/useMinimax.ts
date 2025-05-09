import { findBest, useThrottle } from '../lib'
import { HeuristicCatalog } from '../logic/heuristics'
import { minimaxABP } from '../logic/minimax'
import type { GameState } from '../logic/rules'
import {
  type Heuristic,
  type HeuristicWeights,
  useAgentState,
} from './useAgentState'
import { useGameState, useGameStateComputedAttrs } from './useGameState'
import { useMinimaxStore } from './useMinimaxStore'

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
  const { remote, addResult } = useMinimaxStore()

  const heuristic = useCompoundHeuristic(agent, relaxedMoves, heuristicWeights)

  const makeMoveLocal = () => {
    const startTime = Date.now()
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
    const endTime = Date.now()
    const elapsedTime = endTime - startTime
    if (bestMove !== null) {
      move(...bestMove)
      addResult(elapsedTime)
    }
  }

  // TODO: move url string into .env
  // TODO: gracefully handle errors
  const makeMoveRemote = async () => {
    const moves = state.getPossibleMoves(relaxedMoves)
    const startTime = Date.now()
    const evaluations = await Promise.all(
      moves.map(async move => {
        const outcome = state.move(...move, relaxedMoves)!
        const response = await fetch('http://localhost:3067/minimax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            state: outcome,
            perspective: agent,
            relaxed: relaxedMoves,
            weights: {
              pieces_amount: heuristicWeights['Pieces Amount'],
              pieces_mobility: heuristicWeights['Pieces Mobility'],
              attacking_potential: heuristicWeights['Attacking Potential'],
              isolated_stones_count: heuristicWeights['Isolated Stones'],
              raw_centralization: heuristicWeights['Centralization'],
            },
            depth,
            maximizing: true,
          }),
        })
        const responseValue = (await response.json()) as {
          nano: number
          score: number
        }
        return { ...responseValue, move, outcome } as const
      }),
    )
    const bestMove = findBest(evaluations, ({ score }) => score)
    const endTime = Date.now()
    const elapsedTime = endTime - startTime
    if (bestMove !== null) {
      move(...bestMove.move)
      addResult(elapsedTime)
    }
  }

  const makeMove = () => {
    if (!enabled || state.turn !== agent) {
      return
    }
    if (remote) {
      makeMoveRemote()
    } else {
      makeMoveLocal()
    }
  }

  useThrottle(
    async () => {
      makeMove()
    },
    throttleTime,
    [state],
  )
}
