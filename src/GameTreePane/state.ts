import { create } from 'zustand'
import type { GameState } from '../logic/rules'

type NodeID = GameState['identifier']

export type TreePaneState = {
  show: boolean
  expandedNodes: NodeID[]
  pivotNode: NodeID | null

  open: () => void
  close: () => void
  toggleNode: (id: NodeID) => void
  reset: () => void
  setPivot: (newPivot: NodeID | null) => void
}

const useTreePaneState = create<TreePaneState>(set => ({
  show: false,
  expandedNodes: [],
  pivotNode: null,

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

  reset: () =>
    set(prev => ({
      ...prev,
      expandedNodes: [],
      pivotNode: null,
    })),

  setPivot: newPivot => {
    set(prev => ({
      ...prev,
      pivotNode: newPivot,
    }))
  },
}))

export default useTreePaneState
