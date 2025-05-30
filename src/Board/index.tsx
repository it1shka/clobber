import type { FC } from 'react'
import type { BoardProps } from './types'
import HorizontalAxis from './HorizontalAxis'
import VerticalAxis from './VerticalAxis'
import MainPart from './MainPart'

const Board: FC<BoardProps> = ({
  rows = 6,
  columns = 5,
  pieces = [],
  highlight = [],
  borderWidth = 28,
  onCellClick = () => {},
  showBorder = true,
}) => {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      {showBorder && (
        <HorizontalAxis columns={columns} borderWidth={borderWidth} />
      )}
      <div className="flex-1 flex flex-row">
        {showBorder && <VerticalAxis rows={rows} borderWidth={borderWidth} />}
        <MainPart
          rows={rows}
          columns={columns}
          pieces={pieces}
          highlight={highlight}
          onCellClick={onCellClick}
        />
        {showBorder && <VerticalAxis rows={rows} borderWidth={borderWidth} />}
      </div>
      {showBorder && (
        <HorizontalAxis columns={columns} borderWidth={borderWidth} />
      )}
    </div>
  )
}

export default Board
