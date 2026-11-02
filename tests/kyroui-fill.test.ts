import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { basename } from 'node:path'
import { chromium, type Browser, type Page } from 'playwright'

let browser: Browser
let server: ReturnType<typeof Bun.serve>

beforeAll(async () => {
  await GlobalRegistrator.unregister()
  const built = await Bun.build({
    entrypoints: [`${import.meta.dir}/fixtures/fill.tsx`],
    target: 'browser',
    define: { 'process.env.NODE_ENV': '"production"' },
  })
  if (!built.success) throw new AggregateError(built.logs, 'the fill fixture did not build')
  const files = new Map(built.outputs.map((output) => [`/${basename(output.path)}`, output]))
  const script = [...files.keys()].find((path) => path.endsWith('.js'))
  const style = [...files.keys()].find((path) => path.endsWith('.css'))
  const page = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${style}"><style>body{margin:0}</style></head><body><div id="root"></div><script type="module" src="${script}"></script></body></html>`
  server = Bun.serve({
    port: 0,
    fetch: (request) => {
      const file = files.get(new URL(request.url).pathname)
      return file ? new Response(file) : new Response(page, { headers: { 'content-type': 'text/html' } })
    },
  })
  browser = await chromium.launch()
}, 60_000)

afterAll(async () => {
  await browser?.close()
  server?.stop(true)
  GlobalRegistrator.register()
})

type Mode = 'paged' | 'infinite'

async function open(height: number, mode: Mode, rows: number, pageSize = 25) {
  const page = await browser.newPage({ viewport: { width: 1000, height } })
  await page.goto(`${server.url}?mode=${mode}&rows=${rows}&pageSize=${pageSize}`)
  await page.waitForSelector('tbody tr[data-row], .KyroTable-empty')
  await page.waitForTimeout(300)
  return page
}

const measure = (page: Page) =>
  page.evaluate(() => {
    const scroller = document.querySelector<HTMLElement>('[data-scroll-root]')
    const card = (scroller ?? document.querySelector<HTMLElement>('.KyroTable-empty'))!.parentElement!
    const footer = document.querySelector<HTMLElement>('[data-table-footer]')
    return {
      gapBelow: innerHeight - (footer ?? card).getBoundingClientRect().bottom,
      pageHeight: document.scrollingElement!.scrollHeight,
      innerHeight,
      scrolls: scroller ? scroller.scrollHeight > scroller.clientHeight : false,
      overflows: scroller ? scroller.querySelector('table')!.offsetHeight > scroller.clientHeight : false,
    }
  })

const windows = [600, 800, 1100]
const counts = [0, 4, 100]

describe('a KyroUI table inside a flex column that fills the window', () => {
  for (const mode of ['paged', 'infinite'] as const) {
    describe(`in ${mode} mode`, () => {
      const gaps: number[] = []

      for (const height of windows) {
        for (const rows of counts) {
          test(`with ${rows} rows in a ${height}px window it fills the space without making the page taller, and scrolls only rows that do not fit`, async () => {
            const page = await open(height, mode, rows)
            const result = await measure(page)
            await page.close()

            gaps.push(Math.round(result.gapBelow))
            expect(result.pageHeight).toBe(result.innerHeight)
            expect(result.scrolls).toBe(result.overflows)
          }, 30_000)
        }
      }

      test('its bottom edge sits the same distance above the window bottom in every case', () => {
        expect(gaps).toHaveLength(windows.length * counts.length)
        expect(new Set(gaps).size).toBe(1)
      })
    })
  }

  for (const mode of ['paged', 'infinite'] as const) {
    test(`in ${mode} mode the header row stays in view while the rows scroll under it`, async () => {
      const page = await open(600, mode, 100)
      const offset = await page.evaluate(async () => {
        const scroller = document.querySelector<HTMLElement>('[data-scroll-root]')!
        scroller.scrollTop = 300
        await new Promise(requestAnimationFrame)
        return scroller.querySelector('thead th')!.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      })
      await page.close()

      expect(Math.round(offset)).toBe(0)
    }, 30_000)
  }

  test('in infinite mode, pages too small to fill the box keep loading until the box can scroll', async () => {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1100 } })
    await page.goto(`${server.url}?mode=infinite&rows=100&pageSize=4`)

    await page.waitForFunction(() => {
      const scroller = document.querySelector<HTMLElement>('[data-scroll-root]')
      return scroller !== null && scroller.scrollHeight > scroller.clientHeight
    }, undefined, { timeout: 10_000 })
    await page.close()
  }, 30_000)
})
