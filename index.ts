import { createCanvas } from 'canvas'
import { RandpixColorScheme } from './themes'
import {
  Color,
  ColorScheme,
  Pattern,
  RandpixOptions,
  RandpixResult,
  Symmetry,
} from './types'
import seedrandom from 'seedrandom'

export { RandpixColorScheme, Color, ColorScheme, Symmetry }

const randomColor = (set: ColorScheme, seed?: number | string): Color => {
  const randomFunction = seed ? seedrandom(String(seed)) : Math.random
  const weights: number[] = set.map(v => v[3] ?? 0)
  for (let i = 0; i < set.length; i++) weights[i] += weights[i - 1] ?? 0
  const random = randomFunction() * weights[weights.length - 1]
  for (let i = 0; i < weights.length; i++)
    if (weights[i] > random) {
      return set[i]
    }
  return set[(randomFunction() * set.length) >> 0]
}

const createPattern = (
  w: number,
  h: number,
  colorScheme: ColorScheme,
  chance: number,
  color?: Color,
  seed?: string | number
): Pattern => {
  const pattern: ColorScheme[] = []
  for (let i = 0; i < h; i++) {
    pattern[i] = []
    for (let j = 0; j < w; j++) {
      if ((seed ? seedrandom(String(seed))() : Math.random()) < chance)
        pattern[i][j] = color ?? randomColor(colorScheme, seed)
      else pattern[i][j] = [-1, -1, -1]
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
  colorScheme: ColorScheme = RandpixColorScheme.NEUTRAL,
  chance: number = 0.5,
  color?: Color,
  seed?: string | number
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
    createPattern(size[0], size[1], colorScheme, chance, color, seed),
    !!size.find(v => !Number.isInteger(v))
  )
}

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
      options?.colorScheme ?? RandpixColorScheme.NEUTRAL,
      options?.fillFactor ?? 0.5,
      options?.color,
      options?.seed
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
