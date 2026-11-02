import { afterEach, expect, spyOn, test } from 'bun:test'
import { act, render, waitFor } from '@testing-library/react'
import { useDataTable, type DataTableApi } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
  country: string
}

const items: Item[] = [
  { id: '1', name: 'Katherine Turing', country: 'Japan' },
  { id: '2', name: 'Al', country: 'United Kingdom of Great Britain' },
  { id: '3', name: 'Barbara Hamilton', country: 'France' },
]

let measured = 0
afterEach(() => {
  measured = 0
})

function widthsChangeOnEveryMeasure() {
  return spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    measured += 1
    const width = this.tagName === 'TABLE' ? 1000 : 100 + measured
    return DOMRect.fromRect({ x: 0, y: 0, width, height: 40 })
  })
}

function Table({ columns, onApi }: { columns: ('name' | 'country')[]; onApi: (api: DataTableApi<Item, 'name' | 'country' | 'id'>) => void }) {
  const api = useDataTable<Item, 'name' | 'country' | 'id'>({
    data: items,
    columns: columns.map((field) => ({ field, headerName: field })),
    getRowId: (row) => row.id,
  })
  onApi(api)
  return <DataTable api={api} />
}

const colWidths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('colgroup col')).map((col) => col.style.width)

test('a paged table keeps its column widths when the rows are sorted', async () => {
  const spy = widthsChangeOnEveryMeasure()
  let api!: DataTableApi<Item, 'name' | 'country' | 'id'>
  const { container } = render(<Table columns={['name', 'country']} onApi={(next) => (api = next)} />)
  await waitFor(() => expect(container.querySelectorAll('tbody tr[data-row]').length).toBe(3))
  await waitFor(() => expect(colWidths(container).length).toBe(2))
  const before = colWidths(container)

  act(() => api.setSort({ field: 'country', direction: 'asc' }))
  await waitFor(() => expect(container.querySelector('tbody tr[data-row] td:last-child')?.textContent).toBe('France'))

  expect(colWidths(container)).toEqual(before)
  expect(container.querySelector('table')!.style.tableLayout).toBe('fixed')
  spy.mockRestore()
})

test('changing which columns show measures the widths afresh', async () => {
  const spy = widthsChangeOnEveryMeasure()
  const { container, rerender } = render(<Table columns={['name', 'country']} onApi={() => {}} />)
  await waitFor(() => expect(colWidths(container).length).toBe(2))

  rerender(<Table columns={['name']} onApi={() => {}} />)

  await waitFor(() => expect(colWidths(container).length).toBe(1))
  spy.mockRestore()
})
