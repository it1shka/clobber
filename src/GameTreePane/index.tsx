import '@xyflow/react/dist/style.css'
import { useEffect } from 'react'
import {
  Background,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import useTreePaneState from './state'
import TreeNode from './TreeNode'
import { GameStateNode, useEdges, useNodes } from './graphHooks'

const GameTreePane = () => {
  const { show, close } = useTreePaneState()

  const [nodes, setNodes, onNodesChange] = useNodesState<GameStateNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const graphNodes = useNodes()
  useEffect(() => {
    setNodes(graphNodes)
  }, [graphNodes])

  const graphEdges = useEdges()
  useEffect(() => {
    setEdges(graphEdges)
  }, [graphEdges])

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
        nodesConnectable={false}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes={{
          customTreeNode: TreeNode,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default GameTreePane
