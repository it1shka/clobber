import { create } from 'zustand'
import type { GameState } from '../logic/rules'

type NodeID = GameState['identifier']

export type TreePaneState = {
  show: boolean
  expandedNodes: NodeID[]

  open: () => void
  close: () => void
  toggleNode: (id: NodeID) => void
}

const useTreePaneState = create<TreePaneState>(set => ({
  show: false,
  expandedNodes: [],

  open: () =>
    set(prev => ({
      ...prev,
      show: true,
    })),

  close: () =>
    set(prev => ({
      ...prev,
      show: false,
    })),

  toggleNode: id =>
    set(prev => ({
      ...prev,
      expandedNodes: prev.expandedNodes.includes(id)
        ? prev.expandedNodes.filter(nodeId => nodeId !== id)
        : [...prev.expandedNodes, id],
    })),
}))

export default useTreePaneState
