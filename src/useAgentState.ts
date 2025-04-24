import { create } from 'zustand'
import { HeuristicCatalog } from './logic/heuristics'

type Heuristic = keyof typeof HeuristicCatalog

type HeuristicWeights = {
  [heuristic in Heuristic]: number
}

type AgentStateVars = {
  enabled: boolean
  throttleTime: number
  heuristicWeights: HeuristicWeights
}

type AgentStateActions = {
  toggleEnabled(): void
  setThrottleTime(throttleTime: number): void
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
    heuristicWeights: initialWeights,
  } satisfies AgentStateVars
}

const createAgentStateStore = () => {
  return create<AgentStateStore>(set => {
    return {
      ...createInitialState(),

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

export const useFirstAgentStore = createAgentStateStore()
export const useSecondAgentStore = createAgentStateStore()
