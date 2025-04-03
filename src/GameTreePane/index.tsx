import '@xyflow/react/dist/style.css'
import { Background, Controls, ReactFlow } from '@xyflow/react'
import useGameState from '../useGameState'
import useTreePaneState from './state'

const GameTreePane = () => {
  const { show, close } = useTreePaneState()

  const { state } = useGameState()

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

      <ReactFlow
        edges={[]}
        snapGrid={[20, 20]}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default GameTreePane
