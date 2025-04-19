import { Handle, Position } from '@xyflow/react'
import { GameState } from '../logic/rules'
import Board from '../Board'
import useTreePaneState from './state'
import { getStateDiff } from '../logic/lib'

type TreeNodeProps = {
  data: Readonly<GameState>
  isConnectable: boolean
}

const CELL_SIZE = 35
const DIFF_COLOR = '#e2cd1a'

const TreeNode = ({ data: gameState, isConnectable }: TreeNodeProps) => {
  const { expandedNodes, toggleNode, pivotNode, setPivot } = useTreePaneState()

  const stateId = gameState.identifier
  const isExpanded = expandedNodes.includes(stateId)
  const isPivot = pivotNode === stateId

  const pivotState =
    pivotNode !== null ? GameState.fromIdentifier(pivotNode) : null
  const pivotDiff =
    pivotState === null || isPivot ? [] : getStateDiff(pivotState, gameState)

  const differenceHighlight = pivotDiff.map(
    ([row, column]) =>
      ({
        row,
        column,
        color: DIFF_COLOR,
      }) as const,
  )

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
          <Board
            pieces={gameState.pieces}
            highlight={differenceHighlight}
            showBorder={false}
          />
        </div>
        <p className="text-gray-700">Turn: {gameState.turn}</p>
        {isExpanded && (
          <button
            className="cursor-pointer bg-red-500 text-white p-1"
            onClick={() => toggleNode(stateId)}
          >
            Collapse
          </button>
        )}
        {!isExpanded && (
          <button
            className="cursor-pointer bg-blue-500 text-white p-1"
            onClick={() => toggleNode(stateId)}
          >
            Expand
          </button>
        )}
        {isPivot && (
          <button
            onClick={() => setPivot(null)}
            className="cursor-pointer bg-orange-500 text-white p-1"
          >
            Unpivot
          </button>
        )}
        {!isPivot && (
          <button
            onClick={() => setPivot(stateId)}
            className="cursor-pointer p-1"
          >
            Pivot
          </button>
        )}
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
