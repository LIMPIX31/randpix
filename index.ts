import { createCanvas } from 'canvas'
import { RandpixColorScheme } from './themes'
import { Color, ColorScheme, Pattern, RandpixOptions, RandpixResult, Symmetry } from './types'
import seedrandom from 'seedrandom'

export { RandpixColorScheme, Color, ColorScheme, Symmetry }

const scaleBias = (bias: number): number => Math.floor((Math.random() * bias) - (bias / 2))

const randomColor = (set: ColorScheme): Color => {
  const weights: number[] = set.map(v => v[3] ?? 0)
  for (let i = 0; i < set.length; i++) weights[i] += weights[i - 1] ?? 0
  const random = Math.random() * weights[weights.length - 1]
  for (let i = 0; i < weights.length; i++)
    if (weights[i] > random) {
      return set[i]
    }
  return set[(Math.random() * set.length) >> 0]
}

const createPattern = (
  w: number,
  h: number,
  colorScheme: ColorScheme,
  chance: number,
  color?: Color,
  bias: number = 0,
  grayscaleBias?: boolean
): Pattern => {
  const pattern: ColorScheme[] = []
  for (let i = 0; i < h; i++) {
    pattern[i] = []
    for (let j = 0; j < w; j++) {
      if (Math.random() < chance) {
        pattern[i][j] = color ?? randomColor(colorScheme)
        if (bias > 0)
          if (grayscaleBias) {
            const scaledBias = scaleBias(bias)
            pattern[i][j] = pattern[i][j].map((v, i) => i < 3 ? v as number + scaledBias : v) as Color
          } else pattern[i][j] = pattern[i][j].map((v, i) => i < 3 ? v as number + scaleBias(bias) : v) as Color
      } else pattern[i][j] = [-1, -1, -1]
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
  bias?: number,
  grayscaleBias?: boolean
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
    createPattern(size[0], size[1], colorScheme, chance, color, bias, grayscaleBias),
    !!size.find(v => !Number.isInteger(v))
  )
}

export const randpix = (options?: RandpixOptions) => {
  if (options?.seed && String(options.seed).length > 0) seedrandom(String(options.seed), { global: true })
  const size = options?.size ?? 8
  const scale = options?.scale ?? 1
  const scaledsize = size * scale
  const canvas = createCanvas(scaledsize, scaledsize)
  const ctx = canvas.getContext('2d', {
    alpha: true
  })
  return (): RandpixResult => {
    const pattern = createFinalPattern(
      size,
      size,
      options?.symmetry ?? Symmetry.VERTICAL,
      options?.colorScheme ?? RandpixColorScheme.NEUTRAL,
      options?.fillFactor ?? 0.5,
      options?.color,
      options?.colorBias,
      options?.grayscaleBias
    )
    ctx.clearRect(0, 0, scaledsize, scaledsize)
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
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
