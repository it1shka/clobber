import { create } from 'zustand'
import { GameState } from './logic/rules'

const DEFAULT_ROWS = 6
const DEFAULT_COLUMNS = 5

type GameStateStore = {
  memory: Readonly<GameState>[]
  pointer: number

  getUnderPointer: () => Readonly<GameState>
  getActiveHistory: () => Readonly<GameState>[]

  restart: () => void
  resizeAndRestart: (rows: number, columns: number) => void
  move: (
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
  ) => void
  back: () => void
  forth: () => void
}

export const useGameState = create<GameStateStore>((set, get) => {
  const initialState = GameState.initial(DEFAULT_ROWS, DEFAULT_COLUMNS)

  return {
    memory: [initialState],
    pointer: 0,

    getUnderPointer: () => get().memory[get().pointer],
    getActiveHistory: () => get().memory.slice(0, get().pointer + 1),

    restart: () => {
      set(prev => {
        const { rows, columns } = prev.getUnderPointer()
        const newInitialState = GameState.initial(rows, columns)
        return {
          ...prev,
          memory: [newInitialState],
          pointer: 0,
        }
      })
    },

    resizeAndRestart: (rows, columns) => {
      const newInitialState = GameState.initial(rows, columns)
      set(prev => {
        return {
          ...prev,
          memory: [newInitialState],
          pointer: 0,
        }
      })
    },

    move: (fromRow, fromColumn, toRow, toColumn) => {
      set(prev => {
        const prevState = prev.getUnderPointer()
        const nextState = prevState.move(fromRow, fromColumn, toRow, toColumn)
        if (nextState === null) {
          return prev
        }
        const activeHistory = prev.getActiveHistory()
        return {
          ...prev,
          memory: [...activeHistory, nextState],
          pointer: prev.pointer + 1,
        }
      })
    },

    back: () => {
      set(prev => {
        if (prev.pointer <= 0) {
          return prev
        }
        return {
          ...prev,
          pointer: prev.pointer - 1,
        }
      })
    },

    forth: () => {
      set(prev => {
        if (prev.pointer >= prev.memory.length - 1) {
          return prev
        }
        return {
          ...prev,
          pointer: prev.pointer + 1,
        }
      })
    },
  }
})

export const useGameStateComputedAttrs = () => {
  const state = useGameState(({ memory, pointer }) => {
    return memory[pointer]
  })

  const canRollback = useGameState(({ pointer }) => {
    return pointer > 0
  })

  const canForward = useGameState(({ memory, pointer }) => {
    return pointer < memory.length - 1
  })

  return {
    state,
    canRollback,
    canForward,
  } as const
}
