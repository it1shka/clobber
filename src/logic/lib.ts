import type { GameState } from './rules'

export const getStateDiff = (
  stateA: Readonly<GameState>,
  stateB: Readonly<GameState>,
) => {
  const rows = Math.min(stateA.rows, stateB.rows)
  const columns = Math.min(stateA.columns, stateB.columns)
  const difference = new Array<readonly [number, number]>()
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const pieceA = stateA.pieceAt(row, column)
      const pieceB = stateB.pieceAt(row, column)
      const match = JSON.stringify(pieceA) === JSON.stringify(pieceB)
      if (!match) {
        difference.push([row, column])
      }
    }
  }
  return difference
}

export const getChessboardColor = (row: number, column: number) => {
  return (column + (row % 2)) % 2 === 0 ? 'white' : 'black'
}

export const oppositeTurn = (turn: GameState['turn']): GameState['turn'] => {
  return turn === 'black' ? 'white' : 'black'
}

export const getConnectedComponentsCount = (
  perspective: GameState['turn'],
  state: Readonly<GameState>,
) => {
  let marker = 0
  const markers = new Map<number, number>()

  const markGroup = (startRow: number, startColumn: number) => {
    const stack = new Array<readonly [number, number]>()
    stack.push([startRow, startColumn])
    while (stack.length > 0) {
      const [currentRow, currentColumn] = stack.pop()!
      const index = currentRow * state.columns + currentColumn
      markers.set(index, marker)
      for (const neighbor of state.neighborsAt(currentRow, currentColumn)) {
        if (state.pieceAt(...neighbor)?.color !== perspective) {
          continue
        }
        stack.push(neighbor)
      }
    }
    marker++
  }

  for (const piece of state.pieces) {
    const { color, row, column } = piece
    const index = row * state.columns + column
    if (color !== perspective || markers.has(index)) {
      continue
    }
    markGroup(row, column)
  }

  return marker
}
