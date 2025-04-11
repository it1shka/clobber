import type { Node, Edge } from '@xyflow/react'
import { GameState } from '../logic/rules'
import useGameState from '../useGameState'
import useTreePaneState from './state'

export type GameStateNode = Node<Readonly<GameState>>

export const useNodes = (): GameStateNode[] => {
  const { state } = useGameState()
  const { expandedNodes } = useTreePaneState()

  const identifiers = expandedNodes
    .map(nodeId => {
      return GameState.fromIdentifier(nodeId)!.possibleOutcomes.map(
        outcome => outcome.identifier,
      )
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
  const { expandedNodes } = useTreePaneState()
  return expandedNodes
    .map(sourceId => {
      const sourceState = GameState.fromIdentifier(sourceId)!
      return sourceState.possibleOutcomes.map(outcome => {
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
