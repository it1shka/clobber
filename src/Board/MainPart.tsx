import type { FC } from 'react'
import { Position, MainPartProps } from './types'

const MainPart: FC<MainPartProps> = ({
  rows,
  columns,
  pieces,
  highlight,
  onCellClick,
}) => {
  const generatePositions = () => {
    const output: Position[] = []
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        output.push({ row, column })
      }
    }
    return output
  }

  const getPieceColorAt = (row: number, column: number) => {
    const piece = pieces.find(
      piece => piece.row === row && piece.column === column,
    )
    if (piece === undefined) {
      return null
    }
    return piece.color
  }

  const isHighlightedAt = (row: number, column: number) => {
    return highlight.some(marker => {
      return marker.row === row && marker.column === column
    })
  }

  const getHighlightColor = (row: number, column: number) => {
    return highlight.find(({ row: hRow, column: hColumn }) => {
      return hRow === row && hColumn === column
    })?.color
  }

  const positions = generatePositions()

  return (
    <div
      className="flex-1 grid"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {positions.map(({ row, column }, index) => {
        const pieceColor = getPieceColorAt(row, column)
        const pieceElement = (() => {
          switch (pieceColor) {
            case 'white':
              return (
                <div className="cursor-pointer rounded-[100%] bg-orange-700 border-8 border-orange-500 w-full h-full" />
              )
            case 'black':
              return (
                <div className="cursor-pointer rounded-[100%] bg-cyan-700 border-8 border-cyan-500 w-full h-full" />
              )
            default:
              return <></>
          }
        })()
        const isHighlighted = isHighlightedAt(row, column)
        const highlightColor = getHighlightColor(row, column)
        const content = (() => {
          switch (true) {
            case isHighlighted && highlightColor !== undefined:
              return (
                <div
                  className="p-1 w-full h-full"
                  style={{ backgroundColor: highlightColor }}
                >
                  {pieceElement}
                </div>
              )
            case isHighlighted && index % 2 === 0:
              return (
                <div className="bg-pink-200 p-1 w-full h-full">
                  {pieceElement}
                </div>
              )
            case isHighlighted && index % 2 !== 0:
              return (
                <div className="bg-pink-700 p-1 w-full h-full">
                  {pieceElement}
                </div>
              )
            case index % 2 === 0:
              return (
                <div className="bg-white p-1 w-full h-full">{pieceElement}</div>
              )
            default:
              return (
                <div className="bg-gray-500 p-1 w-full h-full">
                  {pieceElement}
                </div>
              )
          }
        })()
        return (
          <div
            key={`${row}:${column}`}
            onClick={() => onCellClick(row, column)}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}

export default MainPart
