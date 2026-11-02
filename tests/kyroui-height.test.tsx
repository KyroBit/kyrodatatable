import { expect, spyOn, test } from 'bun:test'
import { act, render, waitFor } from '@testing-library/react'
import { useDataTable } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

const items = (count: number): Item[] =>
  Array.from({ length: count }, (_, index) => ({ id: String(index + 1), name: `Item ${index + 1}` }))

function Table({ data, infiniteScroll }: { data: Item[]; infiniteScroll?: boolean }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data,
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
    initialPageSize: 10,
  })
  return <DataTable api={api} infiniteScroll={infiniteScroll} />
}

const scrollRoot = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-scroll-root]')!

test('a scrolling table holding fewer rows than a page is only as tall as its rows', async () => {
  const { container } = render(<Table data={items(4)} infiniteScroll />)
  await waitFor(() => expect(container.querySelector('[data-scroll-root]')).not.toBeNull())

  expect(scrollRoot(container).style.height).toBe('')
  expect(parseFloat(scrollRoot(container).style.minHeight) || 0).toBe(0)
  expect(scrollRoot(container).style.maxHeight).not.toBe('')
  expect(scrollRoot(container).style.overflowY).toBe('auto')
})

test('a scrolling table with nothing in it reserves no page of space', async () => {
  const { container } = render(<Table data={[]} infiniteScroll />)
  await waitFor(() => expect(container.querySelector('.KyroTable-empty')).not.toBeNull())

  expect(container.querySelector<HTMLElement>('.KyroTable-empty')!.style.minHeight).toBe('')
})

test('a paged table whose records all fit on one page is only as tall as its rows', async () => {
  const { container } = render(<Table data={items(4)} />)
  await waitFor(() => expect(container.querySelectorAll('tbody tr[data-row]').length).toBe(4))

  expect(parseFloat(scrollRoot(container).style.minHeight) || 0).toBe(0)
})

test('a paged table that spans several pages keeps one page of height, so a short last page never moves the pager', async () => {
  let api!: ReturnType<typeof useDataTable<Item, 'name' | 'id'>>
  function Paged() {
    api = useDataTable<Item, 'name' | 'id'>({
      data: items(25),
      columns: [{ field: 'name', headerName: 'Name' }],
      getRowId: (row) => row.id,
      initialPageSize: 10,
    })
    return <DataTable api={api} />
  }
  const { container } = render(<Paged />)
  await waitFor(() => expect(container.querySelectorAll('tbody tr[data-row]').length).toBe(10))
  const reserved = scrollRoot(container).style.minHeight
  expect(parseFloat(reserved) || 0).toBeGreaterThan(0)

  act(() => api.setPage(3))
  await waitFor(() => expect(container.querySelectorAll('tbody tr[data-row]').length).toBe(5))

  expect(scrollRoot(container).style.minHeight).toBe(reserved)
})

test('a paged table taller than the viewport scrolls inside itself under a sticky header, leaving the pager on screen', async () => {
  const viewport = Object.getOwnPropertyDescriptor(window, 'innerHeight')
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
  const rect = spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.hasAttribute('data-scroll-root')) return DOMRect.fromRect({ x: 0, y: 200, width: 800, height: 300 })
    if (this.hasAttribute('data-table-footer')) return DOMRect.fromRect({ x: 0, y: 524, width: 800, height: 36 })
    return DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 40 })
  })

  const { container } = render(<Table data={items(50)} />)
  await waitFor(() => expect(scrollRoot(container).style.maxHeight).toBe(`${600 - 200 - 60 - 16}px`))

  expect(scrollRoot(container).style.overflowY).toBe('auto')
  expect(container.querySelector('table')!.getAttribute('data-sticky')).toBe('true')
  rect.mockRestore()
  if (viewport) Object.defineProperty(window, 'innerHeight', viewport)
})
