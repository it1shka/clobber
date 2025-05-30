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
import TreeNode from './TreeNode'
import { GameStateNode, useEdges, useNodes, useReset } from './graphHooks'
import { mergeNodes } from './nodePosition'
import { useGameState } from '../stores/useGameState'

const Graph = () => {
  useReset()

  const [nodes, setNodes, onNodesChange] = useNodesState<GameStateNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const { relaxedMoves } = useGameState()

  const graphNodes = useNodes()
  useEffect(() => {
    setNodes(prev => mergeNodes(prev, graphNodes, relaxedMoves))
  }, [graphNodes, setNodes, relaxedMoves])

  const graphEdges = useEdges()
  useEffect(() => {
    setEdges(graphEdges)
  }, [graphEdges, setEdges])

  return (
    <ReactFlow
      fitView
      fitViewOptions={{
        maxZoom: 0.85,
      }}
      nodesConnectable={false}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
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
  )
}

export default Graph
