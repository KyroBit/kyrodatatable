import { expect, test } from 'bun:test'
import { act, render, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { useDataTable, type DataTableApi } from '../src/index.js'

interface Item {
  id: string
  name: string
}

const items: Item[] = [
  { id: '1', name: 'One' },
  { id: '2', name: 'Two' },
]

const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 300)))

function Table({ data, onRender }: { data: () => Item[] | undefined; onRender: (api: DataTableApi<Item, 'name' | 'id'>) => void }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data: data(),
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  onRender(api)
  return null
}

test('passing rows ?? [] while the rows are still loading settles instead of re-rendering forever', async () => {
  let renders = 0
  render(<Table data={() => undefined ?? []} onRender={() => renders++} />)
  await settle()
  const settled = renders
  await settle()

  expect(renders).toBe(settled)
  expect(settled).toBeLessThan(10)
})

test('a fresh array of the same rows each render settles, and still shows them', async () => {
  let renders = 0
  let latest!: DataTableApi<Item, 'name' | 'id'>
  render(<Table data={() => items.filter(() => true)} onRender={(api) => ((latest = api), renders++)} />)
  await settle()
  const settled = renders
  await settle()

  expect(renders).toBe(settled)
  expect(latest.rows.map((row) => row.name)).toEqual(['One', 'Two'])
})

test('data that really changes is shown', async () => {
  let latest!: DataTableApi<Item, 'name' | 'id'>
  let grow!: () => void
  function Growing() {
    const [rows, setRows] = useState(items)
    grow = () => setRows([...rows, { id: '3', name: 'Three' }])
    return <Table data={() => rows} onRender={(api) => (latest = api)} />
  }
  render(<Growing />)
  await waitFor(() => expect(latest.rows).toHaveLength(2))

  act(() => grow())

  await waitFor(() => expect(latest.rows.map((row) => row.name)).toEqual(['One', 'Two', 'Three']))
})
