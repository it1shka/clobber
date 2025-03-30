export type Player = 'black' | 'white'

export type Piece = {
  row: number
  column: number
  color: Player
}

export class GameState {
  private constructor(
    readonly rows: number,
    readonly columns: number,
    readonly turn: Player,
    readonly pieces: Piece[],
  ) {}

  static initial = (rows: number, columns: number) => {
    const pieces: Piece[] = []
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const isWhite = (row * columns + column) % 2 === 0
        pieces.push({
          row,
          column,
          color: isWhite ? 'white' : 'black',
        })
      }
    }
    const initialState = new GameState(rows, columns, 'black', pieces)
    return Object.freeze(initialState)
  }

  private neighbors = (row: number, column: number) => {
    const neighbors: (readonly [number, number])[] = []
    const neighborhood = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
    for (const [rowDelta, columnDelta] of neighborhood) {
      const nextRow = row + rowDelta
      if (nextRow < 0 || nextRow >= this.rows) continue
      const nextColumn = column + columnDelta
      if (nextColumn < 0 || nextColumn >= this.columns) continue
      neighbors.push([nextRow, nextColumn])
    }
    return neighbors
  }
}
