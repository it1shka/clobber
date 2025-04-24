import { create } from 'zustand'
import type { GameState } from './logic/rules'
import { HeuristicCatalog } from './logic/heuristics'

type Heuristic = keyof typeof HeuristicCatalog

type HeuristicWeights = {
  [heuristic in Heuristic]: number
}

type AgentStateVars = {
  enabled: boolean
  throttleTime: number
  depth: number
  heuristicWeights: HeuristicWeights
}

type AgentStateActions = {
  setEnabled(enabled: boolean): void
  toggleEnabled(): void
  setThrottleTime(throttleTime: number): void
  setDepth(depth: number): void
  setHeuristicWeight(heuristic: Heuristic, weight: number): void
  adjustHeuristicWeights(weights: HeuristicWeights): void
}

type AgentStateStore = AgentStateVars & AgentStateActions

const createInitialState = () => {
  const initialWeights = Object.fromEntries(
    Object.keys(HeuristicCatalog).map(heuristic => [heuristic, 1]),
  ) as HeuristicWeights
  return {
    enabled: false,
    throttleTime: 250,
    depth: 3,
    heuristicWeights: initialWeights,
  } satisfies AgentStateVars
}

const createAgentStateStore = () => {
  return create<AgentStateStore>(set => {
    return {
      ...createInitialState(),

      setEnabled: enabled => {
        set(prev => {
          return {
            ...prev,
            enabled,
          }
        })
      },

      toggleEnabled: () => {
        set(prev => {
          return {
            ...prev,
            enabled: !prev.enabled,
          }
        })
      },

      setThrottleTime: throttleTime => {
        set(prev => {
          return {
            ...prev,
            throttleTime,
          }
        })
      },

      setDepth: depth => {
        set(prev => {
          return {
            ...prev,
            depth,
          }
        })
      },

      setHeuristicWeight: (heuristic, weight) => {
        set(prev => {
          const nextWeights = {
            ...prev.heuristicWeights,
            [heuristic]: weight,
          }
          return {
            ...prev,
            heuristicWeights: nextWeights,
          }
        })
      },

      adjustHeuristicWeights: (weights: HeuristicWeights) => {
        set(prev => {
          return {
            ...prev,
            heuristicWeights: weights,
          }
        })
      },
    }
  })
}

export const useBlackAgentStateStore = createAgentStateStore()
export const useWhiteAgentStateStore = createAgentStateStore()

export const useAgentState = (agent: GameState['turn']) => {
  const blackState = useBlackAgentStateStore()
  const whiteState = useWhiteAgentStateStore()

  return agent === 'black' ? blackState : whiteState
}
