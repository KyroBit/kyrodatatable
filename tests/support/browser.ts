import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { basename } from 'node:path'
import { chromium, type Browser } from 'playwright'

export interface FixtureServer {
  browser: Browser
  url: string
  close: () => Promise<void>
}

export async function serveFixture(fixture: string): Promise<FixtureServer> {
  await GlobalRegistrator.unregister()
  const built = await Bun.build({
    entrypoints: [`${import.meta.dir}/../fixtures/${fixture}.tsx`],
    target: 'browser',
    define: { 'process.env.NODE_ENV': '"production"' },
  })
  if (!built.success) throw new AggregateError(built.logs, `the ${fixture} fixture did not build`)
  const files = new Map(built.outputs.map((output) => [`/${basename(output.path)}`, output]))
  const script = [...files.keys()].find((path) => path.endsWith('.js'))
  const style = [...files.keys()].find((path) => path.endsWith('.css'))
  const page = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${style}"><style>body{margin:0}</style></head><body><div id="root"></div><script type="module" src="${script}"></script></body></html>`
  const server = Bun.serve({
    port: 0,
    fetch: (request) => {
      const file = files.get(new URL(request.url).pathname)
      return file ? new Response(file) : new Response(page, { headers: { 'content-type': 'text/html' } })
    },
  })
  const browser = await chromium.launch()
  return {
    browser,
    url: server.url.href,
    close: async () => {
      await browser.close()
      server.stop(true)
      GlobalRegistrator.register()
    },
  }
}
