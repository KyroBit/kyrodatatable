import { transformAsync } from '@babel/core'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { plugin } from 'bun'
import { afterEach } from 'bun:test'
import { readFile } from 'node:fs/promises'

GlobalRegistrator.register()
Reflect.deleteProperty(window.Element.prototype, 'animate')
afterEach(async () => (await import('@testing-library/react')).cleanup())

plugin({
  name: 'react-compiler',
  setup(builder) {
    builder.onLoad({ filter: /\/src\/.*\.tsx?$/ }, async ({ path }) => {
      const compiled = await transformAsync(await readFile(path, 'utf8'), { filename: path })
      return { contents: compiled!.code!, loader: 'js' }
    })
  },
})
