import { create } from 'zustand'

export type TreePaneState = {
  show: boolean
  open: () => void
  close: () => void
}

const useTreePaneState = create<TreePaneState>(set => ({
  show: false,
  open: () =>
    set(prev => ({
      ...prev,
      show: true,
    })),
  close: () =>
    set(prev => ({
      ...prev,
      show: false,
    })),
}))

export default useTreePaneState
