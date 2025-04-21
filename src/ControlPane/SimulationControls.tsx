import CheckboxControl from './CheckboxControl'
import { useGameState } from '../useGameState'

const SimulationControls = () => {
  const { relaxedMoves, setRelaxation } = useGameState()

  return (
    <div className="flex flex-col p-4 items-center gap-2 border-b-4 border-[#eee]">
      <CheckboxControl
        title="Relax move constraint"
        value={relaxedMoves}
        onChange={setRelaxation}
      />
    </div>
  )
}

export default SimulationControls
