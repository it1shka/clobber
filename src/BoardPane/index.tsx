import { useEffect, useState } from 'react'
import Board from '../Board'
import { useGameState, useGameStateComputedAttrs } from '../stores/useGameState'

const DIFF_COLOR = '#e2cd1a'

const BoardPane = () => {
  const { move, relaxedMoves } = useGameState()
  const { state, stateDiff } = useGameStateComputedAttrs()
  const [start, setStart] = useState<readonly [number, number] | null>(null)

  useEffect(() => {
    const handler = () => setStart(null)
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [])

  const possibilitiesHighlight = start
    ? [...state.movesAt(...start, relaxedMoves), start].map(
        ([row, column]) => ({
          row,
          column,
        }),
      )
    : []

  const differenceHighlight = stateDiff
    .filter(([row, column]) => {
      return !possibilitiesHighlight.some(
        ({ row: pRow, column: pColumn }) => row === pRow && column === pColumn,
      )
    })
    .map(
      ([row, column]) =>
        ({
          row,
          column,
          color: DIFF_COLOR,
        }) as const,
    )

  const highlight = [...possibilitiesHighlight, ...differenceHighlight]

  const handleCellClick = (row: number, column: number) => {
    if (start === null) {
      setStart([row, column])
      return
    }
    const [startRow, startColumn] = start
    if (startRow === row && startColumn === column) {
      setStart(null)
      return
    }
    const isMove = state
      .movesAt(...start, relaxedMoves)
      .some(([moveRow, moveColumn]) => {
        return moveRow === row && moveColumn === column
      })
    if (isMove) {
      move(startRow, startColumn, row, column)
      setStart(null)
      return
    }
    setStart([row, column])
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[#eee] w-full h-full">
      <div className="flex flex-col gap-1">
        <div
          onClick={event => event.stopPropagation()}
          style={{
            width: state.columns * 100,
            height: state.rows * 100,
          }}
        >
          <Board
            rows={state.rows}
            columns={state.columns}
            pieces={state.pieces}
            highlight={highlight}
            onCellClick={handleCellClick}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-gray-700 font-bold">
            {state.turn === 'black' ? 'Black turn' : 'White turn'}
          </h2>
          {state.turn === 'black' && <div className="w-4 h-4 bg-cyan-700" />}
          {state.turn === 'white' && <div className="w-4 h-4 bg-orange-700" />}
        </div>
      </div>
    </div>
  )
}

export default BoardPane
