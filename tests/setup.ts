import { transformAsync } from '@babel/core'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { plugin } from 'bun'
import { readFile } from 'node:fs/promises'

GlobalRegistrator.register()

plugin({
  name: 'react-compiler',
  setup(builder) {
    builder.onLoad({ filter: /\/src\/.*\.tsx?$/ }, async ({ path }) => {
      const compiled = await transformAsync(await readFile(path, 'utf8'), { filename: path })
      return { contents: compiled!.code!, loader: 'js' }
    })
  },
})
