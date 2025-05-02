import { create } from 'zustand'
import { GameState } from '../logic/rules'
import { getStateDiff } from '../logic/lib'

const DEFAULT_ROWS = 6
const DEFAULT_COLUMNS = 5

type GameStateStoreVars = {
  memory: Readonly<GameState>[]
  pointer: number
  relaxedMoves: boolean
}

type GameStateStoreActions = {
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
  setRelaxation: (relaxedFlag: boolean) => void
}

type GameStateStore = GameStateStoreVars & GameStateStoreActions

const createInitialState = (gameState: Readonly<GameState>) => {
  return {
    memory: [gameState],
    pointer: 0,
    relaxedMoves: false,
  } satisfies GameStateStoreVars
}

export const useGameState = create<GameStateStore>((set, get) => {
  const initialState = GameState.initial(DEFAULT_ROWS, DEFAULT_COLUMNS)

  return {
    ...createInitialState(initialState),

    getUnderPointer: () => get().memory[get().pointer],
    getActiveHistory: () => get().memory.slice(0, get().pointer + 1),

    restart: () => {
      set(prev => {
        const { rows, columns } = prev.getUnderPointer()
        const newInitialState = GameState.initial(rows, columns)
        return {
          ...prev,
          ...createInitialState(newInitialState),
          relaxedMoves: prev.relaxedMoves,
        }
      })
    },

    resizeAndRestart: (rows, columns) => {
      const newInitialState = GameState.initial(rows, columns)
      set(prev => {
        return {
          ...prev,
          ...createInitialState(newInitialState),
          relaxedMoves: prev.relaxedMoves,
        }
      })
    },

    move: (fromRow, fromColumn, toRow, toColumn) => {
      set(prev => {
        const prevState = prev.getUnderPointer()
        const nextState = prevState.move(
          fromRow,
          fromColumn,
          toRow,
          toColumn,
          prev.relaxedMoves,
        )
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

    setRelaxation: relaxedFlag => {
      set(prev => {
        return {
          ...prev,
          relaxedMoves: relaxedFlag,
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

  const previousState = useGameState(({ memory, pointer }) => {
    if (pointer <= 0) {
      return null
    }
    return memory[pointer - 1]
  })

  const stateDiff =
    previousState !== null ? getStateDiff(previousState, state) : []

  const relaxedMoves = useGameState(({ relaxedMoves }) => {
    return relaxedMoves
  })

  const possibleMoves = state.getPossibleMoves(relaxedMoves)
  const possibleOutcomes = state.getPossibleOutcomes(relaxedMoves)

  return {
    state,
    canRollback,
    canForward,
    stateDiff,
    possibleMoves,
    possibleOutcomes,
  } as const
}
