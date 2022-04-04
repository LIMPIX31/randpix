# Fastest random pixel avatar generator

* **7000 pixel arts per second**
* **Many color schemes**
* **Very simple**
* **Browser support**

<img alt='preview' width="512" height="512" src="https://i.imgur.com/rN8SQC1.png">

## Example

```ts
import { randpix, RandpixColorScheme, Symmetry } from 'randpix'

const generate = randpix({
  colorSet: RandpixColorScheme.DARKULA, // Color theme (default: NEUTRAL)
  size: 8, // Art size. Recommended 7, 8 (odd/even symmetryy) (default: 8)
  scale: 32, // Pixel scale (default: 1)
  symmetry: Symmetry.VERTICAL, // Symmetry (default: VERTICAL)
  color: [255, 100, 50], // Color like [R, G, B] for solid art (default: undefined)
})

const art = generate() // Generating pixel art

const pngBuffer = art.toBuffer('image/png')
const dataURL = art.toDataURL()
```

## Custom color scheme

```ts
const customColorScheme = [
  // [R, G, B, C] - C(Often of color, from 0 to 1) 
  [151, 219, 174, 1],
  [195, 229, 174, .5],
  [241, 225, 166, .5],
  [244, 187, 187, .2]
]

```
