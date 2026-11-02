import { expect, test } from 'bun:test'
import { Glob } from 'bun'

const renderers = `${import.meta.dir}/../src/renderers`

test('no renderer source writes a KyroUI CSS variable by hand; it reads the theme instead', async () => {
  const offenders: string[] = []
  for await (const path of new Glob('**/*.{ts,tsx}').scan(renderers)) {
    const source = await Bun.file(`${renderers}/${path}`).text()
    source.split('\n').forEach((line, index) => {
      if (line.includes('var(--kyro-')) offenders.push(`${path}:${index + 1}`)
    })
  }

  expect(offenders).toEqual([])
})
