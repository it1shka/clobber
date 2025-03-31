import { useState } from 'react'

type MoveHandler = (
  fromRow: number,
  fromColumn: number,
  toRow: number,
  toColumn: number,
) => void

const useMoveInput = (handler: MoveHandler) => {
  const [start, setStart] = useState<readonly [number, number] | null>(null)

  const click = (row: number, column: number) => {
    if (start === null) {
      setStart([row, column])
      return
    }
    const [fromRow, fromColumn] = start
    handler(fromRow, fromColumn, row, column)
    setStart(null)
  }

  const reset = (value: readonly [number, number] | null = null) => {
    setStart(value)
  }

  return {
    start,
    click,
    reset,
  } as const
}

export default useMoveInput
