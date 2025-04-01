import { GameState } from './rules'

export type GameTree = {
  root: Readonly<GameState>
  children: GameTree[]
}

export const buildStateTree = (
  root: Readonly<GameState>,
  depth = 1,
): GameTree => {
  if (depth <= 0) {
    return {
      root,
      children: [],
    }
  }
  const children = root.possibleMoves
    .map(move => root.move(...move))
    .filter((maybeMove): maybeMove is Readonly<GameState> => {
      return maybeMove !== null
    })
    .map(state => buildStateTree(state, depth - 1))
  return {
    root,
    children,
  }
}
