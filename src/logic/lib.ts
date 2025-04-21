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
