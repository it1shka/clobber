import { create } from 'zustand'

type MinimaxStoreVars = {
  remote: boolean
  results: number[]
}

type MinimaxStoreActions = {
  setRemote(remote: boolean): void
  addResult(result: number): void
  clearResults(): void
}

type MinimaxStore = MinimaxStoreVars & MinimaxStoreActions

const createInitialState = () => {
  return {
    remote: false,
    results: [],
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

    addResult: result => {
      set(prev => {
        return {
          ...prev,
          results: [...prev.results, result],
        }
      })
    },

    clearResults: () => {
      set(prev => {
        return {
          ...prev,
          results: [],
        }
      })
    },
  }
})
