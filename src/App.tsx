import Board from './Board'
import { GameState } from './rules'

const App = () => {
  const gameState = GameState.initial(6, 5)

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#eee]">
      <div className="h-[600px] w-[500px]">
        <Board pieces={gameState.pieces} />
      </div>
    </div>
  )
}

export default App
