export type SizeControlProps = {
  title: string
  value: number
  onChange: (newValue: number) => void
  limits: readonly [number, number]
}
