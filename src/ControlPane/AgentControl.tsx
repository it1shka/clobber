import { useAgentState } from '../useAgentState'
import CheckboxControl from './CheckboxControl'
import NumberControl from './NumberControl'
import type { AgentControlProps } from './types'

const AgentControl = ({ title, agent }: AgentControlProps) => {
  const {
    enabled,
    throttleTime,
    heuristicWeights,

    setEnabled,
    setThrottleTime,
    setHeuristicWeight,
    adjustHeuristicWeights,
  } = useAgentState(agent)

  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-bold">{title}</h2>
      <CheckboxControl
        title="Agent enabled"
        value={enabled}
        onChange={setEnabled}
      />
      <NumberControl
        title="Throttle time"
        value={throttleTime}
        onChange={setThrottleTime}
        min={250}
        max={5000}
      />
    </div>
  )
}

export default AgentControl
