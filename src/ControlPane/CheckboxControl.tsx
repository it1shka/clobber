import type { CheckboxControlProps } from './types.ts'

const CheckboxControl = ({ title, value, onChange }: CheckboxControlProps) => {
  return (
    <div className="w-full flex gap-2 items-center">
      {value && (
        <button
          className="rounded-[100%] border-2 border-amber-600 w-[20px] h-[20px] bg-amber-600"
          onClick={() => onChange(false)}
        ></button>
      )}
      {!value && (
        <button
          className="rounded-[100%] border-2 border-amber-600 w-[20px] h-[20px]"
          onClick={() => onChange(true)}
        ></button>
      )}
      <p>
        {title}:{' '}
        {value ? (
          <span className="text-green-600">enabled</span>
        ) : (
          <span className="text-red-600">disabled</span>
        )}
      </p>
    </div>
  )
}

export default CheckboxControl
