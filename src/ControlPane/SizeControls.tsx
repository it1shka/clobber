import { useState } from 'react'
import SizeControl from './SizeControl'
import { useGameState, useGameStateComputedAttrs } from '../useGameState'

const SizeControls = () => {
  const [rows, setRows] = useState(6)
  const [columns, setColumns] = useState(5)

  const { resizeAndRestart } = useGameState()
  const { state } = useGameStateComputedAttrs()
  const difference = state.rows !== rows || state.columns !== columns

  const resizeBoard = () => {
    if (!difference) return
    resizeAndRestart(rows, columns)
  }

  return (
    <div className="flex flex-col p-4 items-center gap-4 border-b-4 border-[#eee]">
      <SizeControl
        title="Rows"
        value={rows}
        onChange={setRows}
        limits={[3, 12]}
      />
      <SizeControl
        title="Columns"
        value={columns}
        onChange={setColumns}
        limits={[3, 12]}
      />
      <button
        className="w-full rounded-xl bg-yellow-600 text-white p-1 hover:bg-yellow-800 cursor-pointer"
        onClick={resizeBoard}
        style={{ backgroundColor: !difference ? '#ccc' : undefined }}
      >
        Change
      </button>
    </div>
  )
}

export default SizeControls
