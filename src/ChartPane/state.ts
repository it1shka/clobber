import { create } from 'zustand'

type ChartPaneVars = {
  visible: boolean
}

type ChartPaneActions = {
  setVisible(visible: boolean): void
}

type ChartPaneStore = ChartPaneVars & ChartPaneActions

const createInitialState = () => {
  return {
    visible: false,
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
  }
})
