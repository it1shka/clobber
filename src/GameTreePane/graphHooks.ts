import {useEffect, useRef} from 'react'
import type { Node, Edge } from '@xyflow/react'
import { GameState } from '../logic/rules'
import useGameState from '../useGameState'
import useTreePaneState from './state'

export type GameStateNode = Node<Readonly<GameState>>

export const useNodes = (): GameStateNode[] => {
  const { state } = useGameState()
  const expandedNodesIds = useTreePaneState(
    ({ expandedNodes }) => expandedNodes,
  )
  const childrenNodes = expandedNodesIds
    .map(nodeId => GameState.fromIdentifier(nodeId)?.possibleOutcomes)
    .filter((state): state is Array<Readonly<GameState>> => state !== null)
    .reduce((acc, elem) => [...acc, ...elem], [])
  const nodes = [state, ...childrenNodes]
  const flowNodes = nodes.map(node => {
    return {
      id: node.identifier,
      type: 'customTreeNode',
      data: node,
      position: { x: 0, y: 0 },
    }
  })
  return flowNodes
}

export const useEdges = (): Edge[] => {
  const expandedNodesIds = useTreePaneState(
    ({ expandedNodes }) => expandedNodes,
  )
  return expandedNodesIds
    .map(sourceId => GameState.fromIdentifier(sourceId))
    .filter((sourceState): sourceState is Readonly<GameState> => sourceState !== null)
    .map(sourceState => {
      const sourceId = sourceState.identifier
      return sourceState
        .possibleOutcomes
        .map(outcome => outcome.identifier)
        .map(targetId => ({
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
        }))
    })
    .reduce((acc, elem) => [...acc, ...elem], [])
}
