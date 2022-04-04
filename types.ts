import { Canvas } from 'canvas'

export type Color = [r: number, g: number, b: number, c?: number]
export type ColorScheme = Color[]
export type Pattern = ColorScheme[]

export enum Symmetry {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  QUAD = 'QUAD',
}

export type RandpixOptions = {
  size?: number
  scale?: number
  colorScheme?: ColorScheme
  fillFactor?: number
  symmetry?: Symmetry
  color?: Color
}

export type RandpixResult = Canvas
