export type Position = {
  row: number
  column: number
}

export type Piece = {
  color: 'black' | 'white'
} & Position

export type CellClickHandler = (row: number, column: number) => void

export type BoardProps = Partial<{
  rows: number
  columns: number
  pieces: Piece[]
  highlight: Position[]
  borderWidth: number
  onCellClick: CellClickHandler
}>

export type HAxisProps = {
  columns: number
  borderWidth: number
}

export type VAxisProps = {
  rows: number
  borderWidth: number
}

export type MainPartProps = {
  rows: number
  columns: number
  pieces: Piece[]
  highlight: Position[]
  onCellClick: CellClickHandler
}
