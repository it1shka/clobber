import { create } from 'zustand'

type ChartPaneVars = {
  visible: boolean
  onlyRemote: boolean
}

type ChartPaneActions = {
  setVisible(visible: boolean): void
  setOnlyRemote(onlyRemote: boolean): void
}

type ChartPaneStore = ChartPaneVars & ChartPaneActions

const createInitialState = () => {
  return {
    visible: false,
    onlyRemote: false,
  } satisfies ChartPaneVars
}

export const useChartState = create<ChartPaneStore>(set => {
  return {
    ...createInitialState(),

    setVisible: visible => {
      set(prev => {
        return {
          ...prev,
          visible,
        }
      })
    },

    setOnlyRemote: onlyRemote => {
      set(prev => {
        return {
          ...prev,
          onlyRemote,
        }
      })
    },
  }
})
