import { expect, test } from 'bun:test'
import { render, waitFor } from '@testing-library/react'
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

test('a paged table keeps one page of height, so a short page never moves the controls below it', async () => {
  const { container } = render(<Table data={items(4)} />)
  await waitFor(() => expect(container.querySelectorAll('tbody tr[data-row]').length).toBe(4))

  expect(scrollRoot(container).style.minHeight).not.toBe('')
})
