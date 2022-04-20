const { build } = require('esbuild')
const fs = require('fs/promises')

;(async () => {
  const modules = await fs.readdir('node_modules')

  await build({
    outfile: './lib/index.cjs',
    platform: 'neutral',
    minify: true,
    bundle: true,
    entryPoints: ['./index.ts'],
    external: [...modules],
    format: 'cjs'
  })

  await build({
    outfile: './lib/index.mjs',
    platform: 'neutral',
    minify: true,
    bundle: true,
    entryPoints: ['./index.ts'],
    external: [...modules],
    format: 'esm'
  })

})()
