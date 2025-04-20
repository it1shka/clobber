import type { SizeControlProps } from './types.ts'

const SizeControl = ({
  title,
  value,
  onChange,
  limits: [minLimit, maxLimit],
}: SizeControlProps) => {
  const canDecrease = value > minLimit
  const canIncrease = value < maxLimit

  const decrease = () => {
    if (!canDecrease) return
    onChange(value - 1)
  }

  const increase = () => {
    if (!canIncrease) return
    onChange(value + 1)
  }

  return (
    <div className="w-full flex items-center gap-2">
      <button
        className="px-2 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
        onClick={decrease}
        style={{ backgroundColor: !canDecrease ? '#ccc' : undefined }}
      >
        {'-'}
      </button>
      <p className="flex-1">
        {title}: {value}
      </p>
      <button
        className="px-2 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
        onClick={increase}
        style={{ backgroundColor: !canIncrease ? '#ccc' : undefined }}
      >
        {'+'}
      </button>
    </div>
  )
}

export default SizeControl
