import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  LineController,
  LineElement,
  PointElement,
  Legend,
} from 'chart.js'
import { MinimaxRemoteStatistics } from '../stores/useMinimaxStore'

export const registerChartComponents = () => {
  Chart.register(
    LineController,
    LineElement,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Tooltip,
    Legend,
  )
}

export const setupGeneralBarchart = (root: HTMLCanvasElement) => {
  return new Chart(root, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Total time',
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

export const setupDedicatedRemoteChart = (root: HTMLCanvasElement) => {
  return new Chart(root, {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          yAlign: 'bottom',
        },
        legend: {
          display: true,
        },
      },
      scales: {},
    },
  })
}

export const generalBarcharUpdater = (chart: Chart, values: number[]) => {
  const maxValue = Math.max(...values)
  const colors = values.map(value => {
    const r = Math.round(255 * (value / maxValue))
    const b = Math.round(255 * (1 - value / maxValue))
    return `rgb(${r}, 0, ${b})`
  })
  const labels = Array.from(Array(values.length), (_, index) => index + 1)
  chart.data.datasets[0].data = values
  chart.data.datasets[0].backgroundColor = colors
  chart.data.labels = labels
  chart.update()
}

export const dedicatedRemoteChartUpdater = (
  chart: Chart,
  values: MinimaxRemoteStatistics[],
) => {
  if (values.length <= 0) {
    chart.data.datasets = [{ data: [] }]
    chart.update()
    return
  }
  const dimensions = Object.keys(values[0])
    .filter(dimension => dimension !== 'score')
    .map(dimension => {
      const vector = values.map(
        record => record[dimension as keyof typeof record],
      )
      const maximum = Math.max(...vector)
      const normalizedVector = vector.map(value => value / maximum)
      return {
        dimension,
        vector,
        normalized: normalizedVector,
      }
    })
  const colors = ['red', 'magenta', 'blue']
  for (let i = 0; i < dimensions.length; i++) {
    const {
      dimension,
      // vector,
      normalized,
    } = dimensions[i]
    chart.data.datasets.push({
      label: dimension,
      data: normalized,
      backgroundColor: colors[i],
    })
  }

  const labels = Array.from(Array(values.length), (_, index) => index + 1)
  chart.data.labels = labels
  chart.update()
}
