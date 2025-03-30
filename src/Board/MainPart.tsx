import type { FC } from 'react'
import { BoardPosition, MainPartProps } from './types'

const generatePositions = (rows: number, columns: number) => {
  const output: BoardPosition[] = []
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      output.push({ row, column })
    }
  }
  return output
}

const MainPart: FC<MainPartProps> = ({ rows, columns, state, highlight }) => {
  const positions = generatePositions(rows, columns)

  return (
    <div
      className="flex-1 grid"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {positions.map(({ row, column }, index) =>
        index % 2 === 0 ? (
          <div className="bg-white" />
        ) : (
          <div className="bg-gray-500" />
        ),
      )}
    </div>
  )
}

export default MainPart
