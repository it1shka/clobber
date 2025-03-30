import type { FC } from 'react'
import { VAxisProps } from './types'

const VerticalAxis: FC<VAxisProps> = ({ rows, borderWidth }) => {
  const axis = Array.from(Array(rows), (_, index) => {
    return index + 1
  })

  return (
    <div
      className="h-full flex flex-col-reverse"
      style={{ width: borderWidth }}
    >
      {axis.map((mark, index) => (
        <div
          key={index}
          className="flex-1 flex justify-center items-center bg-gray-500 text-amber-200 border-gray-700 border-2 border-l-4 border-r-4"
        >
          <p>{mark}</p>
        </div>
      ))}
    </div>
  )
}

export default VerticalAxis
