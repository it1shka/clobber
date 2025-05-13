import CheckboxControl from '../ControlPane/CheckboxControl'
import ChartWidget from './ChartWidget'
import { useChartState } from './state'

const ChartPane = () => {
  const { visible, setVisible, onlyRemote, setOnlyRemote } = useChartState()

  return (
    <div
      style={{
        transform: visible ? 'none' : 'translateX(-100%)',
      }}
      className="w-screen h-screen fixed inset-0 bg-white transition-all"
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-4 cursor-pointer z-1"
      >
        Close
      </button>

      <div className="absolute bottom-[8px] right-[8px]">
        <CheckboxControl
          title="Only remote"
          value={onlyRemote}
          onChange={setOnlyRemote}
        />
      </div>

      {visible && <ChartWidget />}
    </div>
  )
}

export default ChartPane
