import { minimax, minimaxABP, type MinimaxProps } from './minimax'
import type { GameState } from './rules'

export type EvaluateProps = {
  state: GameState
  perspective: GameState['turn']
  evaluation: 'amount' | 'position'
  depth?: number
  minimaxVariant?: 'normal' | 'pruning'
}

export const evaluateGameState = ({
  state,
  perspective,
  evaluation,
  depth = 3,
  minimaxVariant = 'pruning',
}: EvaluateProps) => {
  const evaluationFunction = (() => {
    switch (evaluation) {
      case 'amount':
        return evaluatePiecesAmount
      case 'position':
        return evaluatePiecesPosition
      default:
        throw new Error(`Unknown evaluation criterion: ${evaluation}`)
    }
  })()
  const minimaxProps: MinimaxProps<GameState> = {
    state,
    evaluate: evaluationFunction(perspective),
    depth,
    outcomes: state => state.possibleOutcomes,
    maximizing: true,
  }
  const algorithm = (() => {
    switch (minimaxVariant) {
      case 'normal':
        return minimax
      case 'pruning':
        return minimaxABP
      default:
        throw new Error(`Unknown algorithm: ${minimaxVariant}`)
    }
  })()
  return algorithm(minimaxProps)
}

const evaluatePiecesAmount =
  (perspective: GameState['turn']) => (state: GameState) => {
    return state.pieces.reduce((acc, { color }) => {
      return acc + (color === perspective ? 1 : -1)
    }, 0)
  }

const evaluatePiecesPosition =
  (perspective: GameState['turn']) => (state: GameState) => {
    const movesAmount = state.possibleMoves.length
    return state.turn === perspective ? movesAmount : -movesAmount
  }
