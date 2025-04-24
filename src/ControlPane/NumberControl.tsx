import type { ChangeEventHandler } from 'react'
import type { NumberControlProps } from './types'

const NumberControl = ({
  title,
  value,
  onChange,
  ...rest
}: NumberControlProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) {
      return
    }
    onChange(value)
  }

  return (
    <div className="w-full flex flex-col gap-0.5">
      <label className="text-gray-600 text-xs">{title}</label>
      <input
        className="py-1 px-2 outline-none border-1 border-gray-500 focus:border-amber-600 focus:text-amber-600"
        type="number"
        placeholder={title}
        value={value}
        onChange={handleChange}
        {...rest}
      />
    </div>
  )
}

export default NumberControl
