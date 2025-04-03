import { GameState } from '../logic/rules'
import { buildStateTree } from '../logic/tree'
import useGameState from '../useGameState'
import type { Node, Edge } from '@xyflow/react'

export type StateNode = Node<Readonly<GameState>>

export const useNodesAndEdges = () => {
  const { state } = useGameState()
  const tree = buildStateTree(state)

  const nodes: StateNode[] = [{}]
}
