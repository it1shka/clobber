export type BoardPosition = {
  row: number
  column: number
}

export type BoardState = Array<
  {
    occupiedBy: 'black' | 'white'
  } & BoardPosition
>

export type BoardHighlight = Array<
  {
    color?: string
  } & BoardPosition
>

export type BoardProps = Partial<{
  rows: number
  columns: number
  state: BoardState
  highlight: BoardHighlight
  borderWidth: number
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
  state: BoardState
  highlight: BoardHighlight
}
