import { create } from 'zustand'
import { GameState } from './logic/rules'

const DEFAULT_ROWS = 6
const DEFAULT_COLUMNS = 5

type GameStateStore = {
  state: Readonly<GameState>

  restart: () => void
  resizeAndRestart: (rows: number, columns: number) => void
  move: (
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
  ) => void
}

const useGameState = create<GameStateStore>(set => ({
  state: GameState.initial(DEFAULT_ROWS, DEFAULT_COLUMNS),

  restart: () =>
    set(prev => ({
      ...prev,
      state: GameState.initial(prev.state.rows, prev.state.columns),
    })),

  resizeAndRestart: (rows, columns) =>
    set(prev => ({
      ...prev,
      state: GameState.initial(rows, columns),
    })),

  move: (fromRow, fromColumn, toRow, toColumn) =>
    set(prev => {
      const nextState = prev.state.move(fromRow, fromColumn, toRow, toColumn)
      return {
        ...prev,
        state: nextState ?? prev.state,
      }
    }),
}))

export default useGameState
