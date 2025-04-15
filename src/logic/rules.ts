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

  get identifier() {
    const pieceIdentifier = this.pieces
      .map(({ row, column, color }) => {
        const position = row * this.columns + column
        return { position, color } as const
      })
      .sort(({ position: a }, { position: b }) => a - b)
      .map(({ position, color }) => {
        return `${position}${color.charAt(0)}`
      })
      .join('')
    const headerIndentifier = `r${this.rows}c${this.columns}t${this.turn.charAt(0)}`
    return `${headerIndentifier}:${pieceIdentifier}`
  }

  static fromIdentifier = (identifier: string) => {
    const mainParts = identifier.split(':')
    if (mainParts.length !== 2) {
      return null
    }
    let [headerRaw, piecesRaw] = mainParts
    const headerPattern = /^r(\d+)c(\d+)t(b|w)$/
    const headerParsed = headerPattern.exec(headerRaw)
    if (headerParsed === null) {
      return null
    }
    const [_, rowsRaw, columnsRaw, turnRaw] = headerParsed
    const rows = Number(rowsRaw)
    const columns = Number(columnsRaw)
    const turn = turnRaw === 'b' ? 'black' : 'white'
    const pieces: Piece[] = []
    const piecePattern = /^(\d+)(b|w)/
    let pieceMatch: RegExpExecArray | null = null
    while ((pieceMatch = piecePattern.exec(piecesRaw))) {
      const [whole, positionRaw, colorRaw] = pieceMatch
      const position = Number(positionRaw)
      const row = ~~(position / columns)
      const column = position % columns
      const color = colorRaw === 'b' ? 'black' : 'white'
      pieces.push({
        row,
        column,
        color,
      })
      piecesRaw = piecesRaw.slice(whole.length)
    }
    const state = new GameState(rows, columns, turn, pieces)
    return Object.freeze(state)
  }

  get enemyTurn(): Player {
    switch (this.turn) {
      case 'black':
        return 'white'
      default:
        return 'black'
    }
  }

  neighborsAt = (row: number, column: number) => {
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

  pieceAt = (row: number, column: number) => {
    const piece = this.pieces.find(({ row: pieceRow, column: pieceColumn }) => {
      return pieceRow === row && pieceColumn === column
    })
    if (piece === undefined) {
      return null
    }
    return piece
  }

  movesAt = (row: number, column: number) => {
    const neighbors = this.neighborsAt(row, column)
    const piece = this.pieceAt(row, column)
    if (piece === null || piece.color !== this.turn) {
      return []
    }
    return neighbors.filter(([neighborRow, neighborColumn]) => {
      const enemyPiece = this.pieceAt(neighborRow, neighborColumn)
      return enemyPiece !== null && enemyPiece.color === this.enemyTurn
    })
  }

  get possibleMoves() {
    return this.pieces
      .filter(({ color }) => color === this.turn)
      .reduce((acc, { row, column }) => {
        const localMoves = this.movesAt(row, column).map(
          ([moveRow, moveColumn]) => {
            return [row, column, moveRow, moveColumn] as const
          },
        )
        return [...acc, ...localMoves]
      }, new Array<readonly [number, number, number, number]>())
  }

  get possibleOutcomes(): Array<Readonly<GameState>> {
    return this.possibleMoves
      .map(move => this.move(...move))
      .filter((move): move is Readonly<GameState> => move !== null)
  }

  move = (
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
  ): Readonly<GameState> | null => {
    const moves = this.movesAt(fromRow, fromColumn)
    const isPossible = moves.some(([row, column]) => {
      return row === toRow && column === toColumn
    })
    if (!isPossible) {
      return null
    }
    const nextPieces = this.pieces.filter(({ row, column }) => {
      const notFrom = row !== fromRow || column !== fromColumn
      const notTo = row !== toRow || column !== toColumn
      return notFrom && notTo
    })
    nextPieces.push({
      row: toRow,
      column: toColumn,
      color: this.turn,
    })
    const nextState = new GameState(
      this.rows,
      this.columns,
      this.enemyTurn,
      nextPieces,
    )
    return Object.freeze(nextState)
  }
}
