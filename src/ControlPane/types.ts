export type SizeControlProps = {
  title: string
  value: number
  onChange: (newValue: number) => void
  limits: readonly [number, number]
}

export type CheckboxControlProps = {
  title: string
  value: boolean
  onChange: (newValue: boolean) => void
}
