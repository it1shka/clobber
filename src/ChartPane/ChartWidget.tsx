import { Chart } from 'chart.js'
import { useEffect, useRef } from 'react'
import { useMinimaxStore } from '../stores/useMinimaxStore'
import { useChartState } from './state'
import {
  dedicatedRemoteChartUpdater,
  generalBarcharUpdater,
  registerChartComponents,
  setupDedicatedRemoteChart,
  setupGeneralBarchart,
} from './chartFunctions'

registerChartComponents()

const ChartWidget = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart>(null)
  const { onlyRemote } = useChartState()

  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }
    if (chartRef.current !== null) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    chartRef.current = onlyRemote
      ? setupDedicatedRemoteChart(canvasRef.current)
      : setupGeneralBarchart(canvasRef.current)
  }, [onlyRemote])

  const { results, clearResults } = useMinimaxStore()
  useEffect(() => {
    if (chartRef.current === null || onlyRemote) {
      return
    }
    generalBarcharUpdater(chartRef.current, results)
  }, [results, onlyRemote])

  const { remoteResults } = useMinimaxStore()
  useEffect(() => {
    if (chartRef.current === null || !onlyRemote) {
      return
    }
    dedicatedRemoteChartUpdater(chartRef.current, remoteResults)
  }, [remoteResults, onlyRemote])

  return (
    <div className="w-full h-full flex flex-col py-4 px-4 gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Minimax Statistics</h2>
        <button
          className="bg-red-500 text-white py-1 px-2 hover:bg-red-700 rounded-md cursor-pointer"
          onClick={clearResults}
        >
          Clear
        </button>
      </div>
      <div className="flex-1">
        <canvas ref={canvasRef}>Canvas is not supported by your browser</canvas>
      </div>
    </div>
  )
}

export default ChartWidget
