import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useEffect, useRef } from 'react'
import { useMinimaxStore } from '../stores/useMinimaxStore'

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip)

const RemoteChartWidget = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart>(null)

  useEffect(() => {
    if (canvasRef.current !== null && chartRef.current === null) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              enabled: true,
              yAlign: 'bottom',
            },
          },
        },
      })
    }
  }, [])

  const { results, clearResults } = useMinimaxStore()
  useEffect(() => {
    if (chartRef.current) {
      const maxValue = Math.max(...results)
      const colors = results.map(value => {
        const r = Math.round(255 * (value / maxValue))
        const b = Math.round(255 * (1 - value / maxValue))
        return `rgb(${r}, 0, ${b})`
      })
      const labels = Array.from(Array(results.length), (_, index) => index + 1)
      chartRef.current.data.datasets[0].data = results
      chartRef.current.data.datasets[0].backgroundColor = colors
      chartRef.current.data.labels = labels

      chartRef.current.update()
    }
  }, [results])

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

export default RemoteChartWidget
