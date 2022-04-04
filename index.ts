import { Canvas, createCanvas } from 'canvas'
import { RandpixColorSet } from './themes'
import { Color, ColorSet, Pattern } from './types'

export { RandpixColorSet, Color, ColorSet }

const randomColor = (set: ColorSet): Color => {
  const weights: number[] = set.map(v => v[3])
  for (let i = 0; i < set.length; i++) weights[i] += weights[i - 1] ?? 0
  const random = Math.random() * weights[weights.length - 1]
  for (let i = 0; i < weights.length; i++)
    if (weights[i] > random) {
      return set[i]
    }
  return set[(Math.random() * set.length) >> 0]
}

export enum Symmetry {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  QUAD = 'QUAD',
}

const createPattern = (
  w: number,
  h: number,
  colorSet: ColorSet,
  chance: number,
  color?: Color
): Pattern => {
  const pattern: ColorSet[] = []
  for (let i = 0; i < h; i++) {
    pattern[i] = []
    for (let j = 0; j < w; j++) {
      if (Math.random() < chance) pattern[i][j] = color ?? randomColor(colorSet)
      else pattern[i][j] = [-1, -1, -1, -1]
    }
  }
  return pattern
}

const reflect = (symm: Symmetry, pattern: Pattern, isOdd: boolean): Pattern => {
  switch (symm) {
    case Symmetry.HORIZONTAL: {
      if (isOdd) return [...pattern, ...pattern.reverse().slice(1)]
      else return [...pattern, ...pattern.reverse()]
    }
    case Symmetry.VERTICAL: {
      if (isOdd) return pattern.map(v => [...v.slice(1).reverse(), ...v])
      else return pattern.map(v => [...v.slice().reverse(), ...v])
    }
    case Symmetry.QUAD: {
      return reflect(
        Symmetry.HORIZONTAL,
        reflect(Symmetry.VERTICAL, pattern, isOdd),
        isOdd
      )
    }
  }
}

const createFinalPattern = (
  w: number,
  h: number,
  symm: Symmetry,
  colorSet: ColorSet = RandpixColorSet.NEUTRAL,
  chance: number = 0.5,
  color?: Color
): Pattern => {
  let size = [w, h]
  switch (symm) {
    case Symmetry.HORIZONTAL:
      size = [size[0], size[1] / 2]
      break
    case Symmetry.VERTICAL:
      size = [size[0] / 2, size[1]]
      break
    case Symmetry.QUAD:
      size = [size[0] / 2, size[1] / 2]
      break
  }
  return reflect(
    symm,
    createPattern(size[0], size[1], colorSet, chance, color),
    !!size.find(v => !Number.isInteger(v))
  )
}

export type RandpixOptions = {
  size?: number
  scale?: number
  colorSet?: ColorSet
  fillFactor?: number
  symmetry?: Symmetry
  color?: Color
}

export type RandpixResult = Canvas

export const randpix = (options?: RandpixOptions) => {
  const size = options?.size ?? 8
  const scale = options?.scale ?? 1
  const scaledsize = size * scale
  const canvas = createCanvas(scaledsize, scaledsize)
  const ctx = canvas.getContext('2d', {
    alpha: true,
  })
  return (): RandpixResult => {
    const pattern = createFinalPattern(
      size,
      size,
      options?.symmetry ?? Symmetry.VERTICAL,
      options?.colorSet ?? RandpixColorSet.NEUTRAL,
      options?.fillFactor ?? 0.5,
      options?.color
    )
    ctx.clearRect(0, 0, scaledsize, scaledsize)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const color = pattern[i][j]
        if (!color.includes(-1)) {
          ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          ctx.fillRect(j * scale, i * scale, scale, scale)
        }
      }
    }
    return canvas
  }
}
