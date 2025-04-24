import { getConnectedComponentsCount, oppositeTurn } from './lib'
import type { GameState } from './rules'

export type Heuristic = (
  perspective: GameState['turn'],
  relaxed: boolean,
) => (state: Readonly<GameState>) => number

/** For relaxed version */
export const byPiecesAmount: Heuristic = perspective => state => {
  return state.pieces.reduce((acc, piece) => {
    const { color } = piece
    const delta = color === perspective ? 1 : -1
    return acc + delta
  }, 0)
}

export const byPiecesMobility: Heuristic = (perspective, relaxed) => state => {
  return state.pieces.reduce((acc, piece) => {
    const { color, row, column } = piece
    const availableMoves = state.movesAt(row, column, relaxed)
    const delta =
      color === perspective ? availableMoves.length : -availableMoves.length
    return acc + delta
  }, 0)
}

/** For relaxed version */
export const byAttackingPotential: Heuristic =
  (perspective, relaxed) => state => {
    return state.pieces.reduce((acc, piece) => {
      const { color, row, column } = piece
      const availableMoves = state.movesAt(row, column, relaxed)
      const attackingPotential = availableMoves.reduce((acc, move) => {
        const [row, column] = move
        const maybeOpponentPiece = state.pieceAt(row, column)
        const delta = maybeOpponentPiece !== null ? 1 : 0
        return acc + delta
      }, 0)
      const delta =
        color === perspective ? attackingPotential : -attackingPotential
      return acc + delta
    }, 0)
  }

/** For strict version */
export const byIsolatedStones: Heuristic = (perspective, relaxed) => state => {
  return state.pieces.reduce((acc, piece) => {
    const { color, row, column } = piece
    const availableMoves = state.movesAt(row, column, relaxed)
    const delta = (() => {
      switch (true) {
        case availableMoves.length > 0:
          return 0
        case color === perspective:
          return -1
        default:
          return 1
      }
    })()
    return acc + delta
  }, 0)
}

export const byCentralization: Heuristic = perspective => state => {
  const centerRow = (state.rows - 1) / 2
  const centerColumn = (state.columns - 1) / 2
  let myPieces = 0,
    enemyPieces = 0
  let myDistance = 0,
    enemyDistance = 0
  for (const piece of state.pieces) {
    const { color, row, column } = piece
    const distance = Math.abs(row - centerRow) + Math.abs(column - centerColumn)
    if (color === perspective) {
      myPieces++
      myDistance += distance
    } else {
      enemyPieces++
      enemyDistance += distance
    }
  }
  return enemyDistance / enemyPieces - myDistance / myPieces
}

export const byConnectedComponents: Heuristic = perspective => state => {
  const myComponents = getConnectedComponentsCount(perspective, state)
  const enemyComponents = getConnectedComponentsCount(
    oppositeTurn(perspective),
    state,
  )
  return enemyComponents - myComponents
}

export const HeuristicCatalog = Object.freeze({
  'Pieces Amount': byPiecesAmount,
  'Pieces Mobility': byPiecesMobility,
  'Attacking Potential': byAttackingPotential,
  'Isolated Stones': byIsolatedStones,
  Centralization: byCentralization,
  'Connected Components': byConnectedComponents,
}) satisfies { [heuristicName: string]: Heuristic }
