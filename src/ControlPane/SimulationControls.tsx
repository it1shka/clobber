import CheckboxControl from './CheckboxControl'
import { useGameState } from '../stores/useGameState'
import AgentControl from './AgentControl'
import { useMinimaxStore } from '../stores/useMinimaxStore'

const SimulationControls = () => {
  const { relaxedMoves, setRelaxation } = useGameState()
  const { remote, setRemote } = useMinimaxStore()

  return (
    <div className="flex flex-col p-4 items-center gap-4 border-b-4 border-[#eee]">
      <CheckboxControl
        title="Remote compute"
        value={remote}
        onChange={setRemote}
      />
      <CheckboxControl
        title="Relax move constraint"
        value={relaxedMoves}
        onChange={setRelaxation}
      />
      <AgentControl title="Black agent" agent="black" />
      <AgentControl title="White agent" agent="white" />
    </div>
  )
}

export default SimulationControls
