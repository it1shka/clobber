import { InputHTMLAttributes } from 'react'
import type { GameState } from '../logic/rules'

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

export type AgentControlProps = {
  title: string
  agent: GameState['turn']
}

export type NumberControlProps = {
  title: string
  value: number
  onChange: (value: number) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'title' | 'value' | 'onChange'>
