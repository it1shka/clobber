import type { FC } from 'react'
import type { BoardProps } from './types'
import HorizontalAxis from './HorizontalAxis'
import VerticalAxis from './VerticalAxis'
import MainPart from './MainPart'

const Board: FC<BoardProps> = ({
  rows = 6,
  columns = 5,
  state = [],
  highlight = [],
  borderWidth = 28,
}) => {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <HorizontalAxis columns={columns} borderWidth={borderWidth} />
      <div className="flex-1 flex flex-row">
        <VerticalAxis rows={rows} borderWidth={borderWidth} />
        <MainPart
          rows={rows}
          columns={columns}
          state={state}
          highlight={highlight}
        />
        <VerticalAxis rows={rows} borderWidth={borderWidth} />
      </div>
      <HorizontalAxis columns={columns} borderWidth={borderWidth} />
    </div>
  )
}

export default Board
