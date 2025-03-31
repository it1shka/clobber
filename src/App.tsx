import Board from './Board'
import useGameState from './hooks/useGameState'
import useMoveInput from './hooks/useMoveInput'

const App = () => {
  const { state, move } = useGameState()
  const { start, click, reset } = useMoveInput(move)

  const handleCellClick = (row: number, column: number) => {
    const piece = state.pieceAt(row, column)
    if (piece === null) {
      reset()
      return
    }
    if (piece.color === state.turn) {
      reset([row, column])
      return
    }
    click(row, column)
  }

  const highlight = start
    ? [...state.movesAt(...start), start].map(([row, column]) => ({
        row,
        column,
      }))
    : []

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#eee]">
      <div className="h-[600px] w-[500px]">
        <Board
          pieces={state.pieces}
          highlight={highlight}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  )
}

export default App
