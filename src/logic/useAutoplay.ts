import { findBest, useThrottle } from '../lib'
import { type GameState } from '../logic/rules'
import { type Heuristic, useAgentState } from '../stores/useAgentState'
import { useGameState, useGameStateComputedAttrs } from '../stores/useGameState'
import { useMinimaxStore } from '../stores/useMinimaxStore'
import { HeuristicCatalog } from './heuristics'
import { minimax, minimaxABP } from './minimax'

type MinimaxEvaluator = (state: Readonly<GameState>) => Promise<number>

const useLocalMinimax = (agent: GameState['turn']): MinimaxEvaluator => {
  const { relaxedMoves } = useGameState()
  const { depth, heuristicWeights } = useAgentState(agent)
  const { unoptimized } = useMinimaxStore()

  const evaluate = (state: Readonly<GameState>) => {
    if (state.getPossibleMoves(relaxedMoves).length <= 0) {
      return state.turn === agent ? -Infinity : Infinity
    }
    let totalValue = 0
    for (const [heuristic, evaluation] of Object.entries(HeuristicCatalog)) {
      const weight = heuristicWeights[heuristic as Heuristic]
      if (weight <= 0) {
        continue
      }
      totalValue += evaluation(agent, relaxedMoves)(state)
    }
    return totalValue
  }

  const minimaxVariant = unoptimized ? minimax : minimaxABP

  return async (state: Readonly<GameState>): Promise<number> => {
    return minimaxVariant({
      state,
      evaluate,
      outcomes: state => state.getPossibleOutcomes(relaxedMoves),
      depth,
      maximizing: true,
    })
  }
}

const useRemoteMinimax = (agent: GameState['turn']): MinimaxEvaluator => {
  const { relaxedMoves } = useGameState()
  const { depth, heuristicWeights } = useAgentState(agent)
  const { unoptimized, addRemoteResult } = useMinimaxStore()

  return async (state: Readonly<GameState>): Promise<number> => {
    const response = await fetch('/api/minimax-verbose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
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
        kind: unoptimized ? 'unoptimized' : 'alpha-beta-pruning',
      }),
    })
    const responseValue = (await response.json()) as {
      score: number
      elapsed_time: number
      visited_nodes: number
      prunings: number
    }
    addRemoteResult(responseValue)
    return responseValue.score
  }
}

export const useAutoplay = (agent: GameState['turn']) => {
  const { enabled, throttleTime } = useAgentState(agent)
  const { move, relaxedMoves } = useGameState()
  const { state } = useGameStateComputedAttrs()
  const { remote, addResult } = useMinimaxStore()

  const localEvaluator = useLocalMinimax(agent)
  const remoteEvaluator = useRemoteMinimax(agent)
  const evaluator = remote ? remoteEvaluator : localEvaluator

  const reactToStateChanges = async () => {
    if (!enabled || state.turn !== agent) {
      return
    }
    const startMoment = Date.now()
    const possibleMoves = await Promise.all(
      state.getPossibleMoves(relaxedMoves).map(async move => {
        const nextState = state.move(...move, relaxedMoves)!
        const nextEvaluation = await evaluator(nextState)
        return {
          move,
          score: nextEvaluation,
        } as const
      }),
    )
    const bestMove = findBest(possibleMoves, ({ score }) => score, true)
    const endMoment = Date.now()
    addResult(endMoment - startMoment)
    if (bestMove === null) return
    move(...bestMove.move)
  }

  useThrottle(reactToStateChanges, throttleTime, state)
}
