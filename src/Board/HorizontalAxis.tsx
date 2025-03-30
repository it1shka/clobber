import type { FC } from 'react'
import { HAxisProps } from './types'

const HorizontalAxis: FC<HAxisProps> = ({ columns, borderWidth }) => {
  const axis = Array.from(Array(columns), (_, index) => {
    return String.fromCharCode('A'.charCodeAt(0) + index)
  })

  return (
    <div className="w-full flex flex-row" style={{ height: borderWidth }}>
      <div
        className="bg-gray-700 border-gray-700 border-4"
        style={{ width: borderWidth, height: borderWidth }}
      ></div>
      {axis.map((mark, index) => (
        <p
          className="flex-1 text-center bg-gray-500 text-amber-200 border-gray-700 border-2 border-t-4 border-b-4"
          key={index}
        >
          {mark}
        </p>
      ))}
      <div
        className="bg-gray-700 border-gray-700 border-4"
        style={{ width: borderWidth, height: borderWidth }}
      ></div>
    </div>
  )
}

export default HorizontalAxis
