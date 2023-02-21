import type { Options } from 'tsup'

const config: Options = {
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: true,
  format: ['esm'],
}

export default config
