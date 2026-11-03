import { expect, test } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useDataTable } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

function Table({ onImport }: { onImport: () => void }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data: [{ id: '1', name: 'One' }],
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  return <DataTable api={api} onImport={onImport} />
}

const more = () => screen.getByRole('button', { name: 'More', hidden: true })

test('the More button opens its menu from itself and reports it is open', async () => {
  render(<Table onImport={() => {}} />)

  expect(more().getAttribute('aria-haspopup')).toBe('menu')
  expect(more().getAttribute('aria-expanded')).toBe('false')

  fireEvent.click(more())

  expect(await screen.findByRole('menu', { name: 'More' })).toBeDefined()
  expect(more().getAttribute('aria-expanded')).toBe('true')
})

test('choosing Import from the More menu closes it and starts the import', async () => {
  const imports: number[] = []
  render(<Table onImport={() => imports.push(1)} />)

  fireEvent.click(more())
  fireEvent.click(await screen.findByRole('menuitem', { name: /Import/ }))

  expect(imports).toEqual([1])
  await waitFor(() => expect(more().getAttribute('aria-expanded')).toBe('false'))
})

function Exporting({ formats, onExport }: { formats: { id: string; label: string }[]; onExport: (format: string) => void }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data: [{ id: '1', name: 'One' }],
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  return <DataTable api={api} exportFormats={formats} onExport={(request) => onExport(request.format)} />
}

test('the More button stays in view while its menu is open, as the Group button does', async () => {
  render(<Table onImport={() => {}} />)

  fireEvent.click(more())
  await screen.findByRole('menu', { name: 'More' })
  await new Promise((resolve) => setTimeout(resolve, 400))

  expect(more().style.opacity).not.toBe('0')
})

test('several export formats sit in one Export submenu, and choosing one exports it', async () => {
  const exported: string[] = []
  render(
    <Exporting
      formats={[{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel' }]}
      onExport={(format) => exported.push(format)}
    />,
  )

  fireEvent.click(more())
  await screen.findByRole('menu', { name: 'More' })
  expect(screen.queryByRole('menuitem', { name: /Export as/ })).toBeNull()
  fireEvent.click(screen.getByRole('menuitem', { name: /^Export/ }))
  fireEvent.click(await screen.findByRole('menuitem', { name: 'Excel' }))

  expect(exported).toEqual(['xlsx'])
})

test('a single export format is one Export item that exports at once', async () => {
  const exported: string[] = []
  render(<Exporting formats={[{ id: 'csv', label: 'CSV' }]} onExport={(format) => exported.push(format)} />)

  fireEvent.click(more())
  fireEvent.click(await screen.findByRole('menuitem', { name: /^Export/ }))

  expect(exported).toEqual(['csv'])
})

test('the More menu lists Import, then Export, then Settings', async () => {
  function Everything() {
    const api = useDataTable<Item, 'name' | 'id'>({
      data: [{ id: '1', name: 'One' }],
      columns: [{ field: 'name', headerName: 'Name' }],
      getRowId: (row) => row.id,
    })
    return (
      <DataTable
        api={api}
        onImport={() => {}}
        onExport={() => {}}
        exportFormats={[{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel' }]}
      />
    )
  }
  render(<Everything />)

  fireEvent.click(more())
  const menu = await screen.findByRole('menu', { name: 'More' })
  const labels = Array.from(menu.querySelectorAll('[role^=menuitem]')).map((item) => item.textContent ?? '')

  expect(labels.map((label) => label.match(/^(Import|Export|Settings)/)?.[1])).toEqual(['Import', 'Export', 'Settings'])
})
