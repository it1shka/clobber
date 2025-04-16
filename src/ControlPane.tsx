import useTreePaneState from './GameTreePane/state'
import { useGameState, useGameStateComputedAttrs } from './useGameState'

const ControlPane = () => {
  const { open } = useTreePaneState()
  const { back, forth, restart } = useGameState()
  const { canRollback, canForward } = useGameStateComputedAttrs()

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="p-4 font-bold border-b-4 border-[#eee]">Controls</h2>
      <div className="flex-1 flex flex-col p-4 items-center gap-2">
        <button
          onClick={open}
          className="border-4 border-green-500 w-full p-1 rounded-xl text-green-500 cursor-pointer hover:border-green-400 hover:text-green-400"
        >
          Show Game Tree
        </button>
        <div className="w-full flex flex-row items-center gap-2">
          {canRollback && (
            <button
              onClick={back}
              className="flex-1 rounded-xl bg-red-600 text-white p-1 hover:bg-red-800 cursor-pointer"
            >
              Back
            </button>
          )}
          {canForward && (
            <button
              onClick={forth}
              className="flex-1 rounded-xl bg-blue-600 text-white p-1 hover:bg-blue-800 cursor-pointer"
            >
              Forward
            </button>
          )}
        </div>
        <button
          onClick={restart}
          className="w-full rounded-xl bg-yellow-600 text-white p-1 hover:bg-yellow-800 cursor-pointer"
        >
          Restart
        </button>
      </div>
    </div>
  )
}

export default ControlPane
