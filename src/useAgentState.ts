import { create } from "zustand"
import type { GameState } from "./logic/rules" 
import { HeuristicCatalog } from './logic/heuristics.ts'

export type Agent = GameState['turn']
export type Heuristic = keyof (typeof HeuristicCatalog)

type AgentStateVars = {
  enabled: {
    [agent in Agent]: boolean
  }
  weights: {
    [agent in Agent]: {
      [heuristic in Heuristic]: number
    }
  }
}

type AgentStateActions = {
  setEnabled: (agent: Agent, enabled: boolean) => void
  setHeuristicWeight: (agent: Agent, heuristic: Heuristic, weight: number) => void
  adjustHeuristicWeights: (agent: Agent, weights: AgentStateVars['weights'][Agent]) => void
}

type AgentStateStore =
  & AgentStateVars
  & AgentStateActions

const createInitialState = () => {
  const defaultWeights = Object.fromEntries(
    Object
      .keys(HeuristicCatalog)
      .map(heuristic => [heuristic, 1])
  ) as AgentStateVars['weights'][Agent]
  return {
    enabled: {
      black: false,
      white: false,
    },
    weights: {
      black: defaultWeights,
      white: defaultWeights,
    },
  } satisfies AgentStateVars
}

export const useAgentState = create<AgentStateStore>((set) => {
  return {
    ...createInitialState(),

    setEnabled: (agent, enabled) => {
      set(prev => {
        const nextEnabled = { 
          ...prev.enabled,
          [agent]: enabled,
        }
        return {
          ...prev,
          enabled: nextEnabled,
        }
      })
    },

    setHeuristicWeight: (agent, heuristic, weight) => {
      set(prev => {
        const nextWeights = {
          ...prev.weights,
          [agent]: {
            ...prev.weights[agent],
            [heuristic]: weight,
          },
        }
        return {
          ...prev,
          weights: nextWeights,
        }
      })
    },

    adjustHeuristicWeights: (agent, weights) => {
      set(prev => {
        const nextWeights = {
          ...prev.weights,
          [agent]: weights,
        }
        return {
          ...prev,
          nextWeights,
        }
      })
    },
  }
})

export type SingleAgentState = {
  [property in keyof AgentStateVars]: AgentStateVars[property][Agent]
}

const agentSelector = (agent: Agent) => (state: AgentStateVars) => {
  return {
    enabled: state.enabled[agent],
    weights: state.weights[agent],
  } satisfies SingleAgentState
}

export const useAgentStateComputedAttrs = () => {
  const whiteAgentState = useAgentState(agentSelector('white'))
  const blackAgentState = useAgentState(agentSelector('black'))
  return {
    whiteAgentState,
    blackAgentState,
  } as const
}
