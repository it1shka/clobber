import { create } from 'zustand'

export type MinimaxRemoteStatistics = {
  score: number
  elapsed_time: number
  visited_nodes: number
  prunings: number
}

type MinimaxStoreVars = {
  remote: boolean
  unoptimized: boolean
  results: number[]
  remoteResults: MinimaxRemoteStatistics[]
}

type MinimaxStoreActions = {
  setRemote(remote: boolean): void
  addResult(result: number): void
  addRemoteResult(remoteResult: MinimaxRemoteStatistics): void
  setUnoptimized(unoptimized: boolean): void
  clearResults(): void
}

type MinimaxStore = MinimaxStoreVars & MinimaxStoreActions

const createInitialState = () => {
  return {
    remote: false,
    unoptimized: false,
    results: [],
    remoteResults: [],
  } satisfies MinimaxStoreVars
}

export const useMinimaxStore = create<MinimaxStore>(set => {
  return {
    ...createInitialState(),

    setRemote: remote => {
      set(prev => {
        return {
          ...prev,
          remote,
        }
      })
    },

    setUnoptimized: unoptimized => {
      set(prev => {
        return {
          ...prev,
          unoptimized,
        }
      })
    },

    addResult: result => {
      set(prev => {
        return {
          ...prev,
          results: [...prev.results, result],
        }
      })
    },

    addRemoteResult: remoteResult => {
      set(prev => {
        return {
          ...prev,
          remoteResults: [...prev.remoteResults, remoteResult],
        }
      })
    },

    clearResults: () => {
      set(prev => {
        return {
          ...prev,
          results: [],
          remoteResults: [],
        }
      })
    },
  }
})
