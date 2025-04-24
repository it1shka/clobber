import type { HeuristicCatalog } from '../logic/heuristics'
import { useAgentState } from '../useAgentState'
import CheckboxControl from './CheckboxControl'
import NumberControl from './NumberControl'
import SizeControl from './SizeControl'
import type { AgentControlProps } from './types'

const AgentControl = ({ title, agent }: AgentControlProps) => {
  const {
    enabled,
    throttleTime,
    depth,
    heuristicWeights,

    setEnabled,
    setThrottleTime,
    setDepth,
    setHeuristicWeight,
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
      <NumberControl
        title="Depth"
        value={depth}
        onChange={setDepth}
        min={1}
        max={8}
      />
      {Object.entries(heuristicWeights).map(([heuristic, weight]) => {
        return (
          <SizeControl
            key={heuristic}
            title={heuristic}
            value={weight}
            onChange={newWeight => {
              setHeuristicWeight(
                heuristic as keyof typeof HeuristicCatalog,
                newWeight,
              )
            }}
            limits={[0, 10]}
          />
        )
      })}
    </div>
  )
}

export default AgentControl
