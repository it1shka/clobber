import type { Node, Edge } from '@xyflow/react'
import { GameState } from '../logic/rules'
import { useGameState, useGameStateComputedAttrs } from '../useGameState'
import useTreePaneState from './state'
import { useEffect } from 'react'

export type GameStateNode = Node<Readonly<GameState>>

export const useReset = () => {
  const { state } = useGameStateComputedAttrs()
  const { reset } = useTreePaneState()
  useEffect(() => {
    reset()
  }, [state, reset])
}

export const useNodes = (): GameStateNode[] => {
  const { relaxedMoves } = useGameState()
  const { state } = useGameStateComputedAttrs()
  const { expandedNodes } = useTreePaneState()

  const identifiers = expandedNodes
    .map(nodeId => {
      const nodeState = GameState.fromIdentifier(nodeId)!
      const nodeOutcomes = nodeState.getPossibleOutcomes(relaxedMoves)
      return nodeOutcomes.map(outcome => outcome.identifier)
    })
    .reduce((acc, elem) => [...acc, ...elem], [state.identifier])

  const uniqueIdentifiers = Array.from(new Set(identifiers))

  const flowNodes = uniqueIdentifiers.map(nodeId => {
    return {
      id: nodeId,
      type: 'customTreeNode',
      data: GameState.fromIdentifier(nodeId)!,
      position: { x: 0, y: 0 },
    }
  })

  return flowNodes
}

export const useEdges = (): Edge[] => {
  const { relaxedMoves } = useGameState()
  const { expandedNodes } = useTreePaneState()
  return expandedNodes
    .map(sourceId => {
      const sourceState = GameState.fromIdentifier(sourceId)!
      const sourceOutcomes = sourceState.getPossibleOutcomes(relaxedMoves)
      return sourceOutcomes.map(outcome => {
        const targetId = outcome.identifier
        return {
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
        }
      })
    })
    .reduce((acc, elem) => [...acc, ...elem], [])
}
