import { Handle, Position } from '@xyflow/react'
import type { GameState } from '../logic/rules'
import Board from '../Board'
import useTreePaneState from './state'

type TreeNodeProps = {
  data: Readonly<GameState>
  isConnectable: boolean
}

const CELL_SIZE = 35

const TreeNode = ({ data: gameState, isConnectable }: TreeNodeProps) => {
  const { expandedNodes, toggleNode } = useTreePaneState()

  const stateId = gameState.identifier
  const isExpanded = expandedNodes.includes(stateId)

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="bg-white p-2 border-2 border-blue-300 flex flex-col gap-1">
        <div
          className="border-2 border-gray-200"
          style={{
            width: gameState.columns * CELL_SIZE,
            height: gameState.rows * CELL_SIZE,
          }}
        >
          <Board pieces={gameState.pieces} showBorder={false} />
        </div>
        <p className="text-gray-700">Turn: {gameState.turn}</p>
        <button
          className="cursor-pointer bg-blue-500 text-white p-1"
          onClick={() => toggleNode(stateId)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  )
}

export default TreeNode
