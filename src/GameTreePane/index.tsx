import useTreePaneState from './state'
import Graph from './Graph'

const GameTreePane = () => {
  const { show, close } = useTreePaneState()

  return (
    <div
      style={{
        transform: show ? 'none' : 'translateX(-100%)',
      }}
      className="w-screen h-screen fixed inset-0 bg-white transition-all"
    >
      <button
        onClick={close}
        className="absolute top-2 right-4 cursor-pointer z-1"
      >
        Close
      </button>

      {show && <Graph />}
    </div>
  )
}

export default GameTreePane
