# Fastest random pixel avatar generator

- **~8000 pixel arts per second**
- **Many color schemes**
- **Very simple**
- **Browser support**

[Live demo](https://randpix-demo.vercel.app/)

<img alt='preview' width="512" height="512" src="https://i.imgur.com/rN8SQC1.png">

## Installing Canvas for Randpix
| OS      | Command                                                                                                  |
|---------|----------------------------------------------------------------------------------------------------------|
| OS X    | Using [Homebrew](https://brew.sh/):<br/>`brew install pkg-config cairo pango libpng jpeg giflib librsvg` |
| Ubuntu  | `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` |
| Fedora  | `sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel`                      |
| Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`                              |
| OpenBSD | `doas pkg_add cairo pango png jpeg giflib`                                                               |
| Windows | See the [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows)                     |
| Others  | See the [wiki](https://github.com/Automattic/node-canvas/wiki)                                           |

## Example

```ts
import { randpix, RandpixColorScheme, Symmetry } from 'randpix'

const generate = randpix({
  colorScheme: RandpixColorScheme.DARKULA, // Color theme (default: NEUTRAL)
  size: 8, // Art size. Recommended 7 or 8 (odd/even symmetry) (default: 8)
  scale: 32, // Pixel scale (default: 1)
  symmetry: Symmetry.VERTICAL, // Symmetry (default: VERTICAL)
  color: [255, 100, 50], // [R, G, B] like color for solid art (default: undefined),
  seed: 'Some string', // Seed (default: undefined)
  colorBias: 15 //
})

const art = generate() // Generating the pixel art

const pngBuffer = art.toBuffer('image/png')
const dataURL = art.toDataURL()
```

## Custom color scheme

```ts
const customColorScheme = [
  // [R, G, B, C], C is the frequency of this color appearing in the pixel art
  [151, 219, 174, 1],
  [195, 229, 174, 0.5],
  [241, 225, 166, 0.5],
  [244, 187, 187, 0.2],
]
```

## My Benchmarks
```
With defaults: 0.11812 ms/art. Speed: 8465 arts/s
With scale 32: 0.14147 ms/art. Speed: 7068 arts/s
With bias 15: 0.11686 ms/art. Speed: 8557 arts/s
With fullfill: 0.21214 ms/art. Speed: 4713 arts/s
With quarter filled: 0.06061 ms/art. Speed: 16497 arts/s
With quad symmetry: 0.11023 ms/art. Speed: 9072 arts/s
With solid color: 0.10263 ms/art. Speed: 9744 arts/s
Every instanced: 0.15031 ms/art. Speed: 6652 arts/s
```
