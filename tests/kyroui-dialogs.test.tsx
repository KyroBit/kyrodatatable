import { describe, expect, test } from 'bun:test'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@kyrobit/kyroui'
import { useEffect, useState, type ReactNode } from 'react'
import { useDataTable, usePresets, type FilterValues } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

let presetsKey = 0
const data: Item[] = [{ id: '1', name: 'One' }]

function Table({ tooltips = false, selected = false }: { tooltips?: boolean; selected?: boolean }) {
  const api = useDataTable<Item, 'name' | 'id', FilterValues>({
    data,
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  const { setSelection } = api
  useEffect(() => {
    if (selected) setSelection({ '1': true })
  }, [selected, setSelection])
  const [key] = useState(() => `dialogs-${++presetsKey}`)
  const presets = usePresets<FilterValues>(key, [
    { id: 'a', name: 'Active', filters: { name: 'One' } },
  ])
  return (
    <DataTable
      api={api}
      presets={presets}
      filterColumns={[{ type: 'text', field: 'name', label: 'Name' }]}
      onImport={() => {}}
      onExport={() => {}}
      actions={[{ label: 'Delete', confirmationMessage: (count) => `Delete ${count}?`, handle: () => {} }]}
      selectable
      {...(tooltips ? { importTooltip: 'From a CSV file', exportTooltip: 'Everything shown' } : {})}
    />
  )
}

const themed = (children: ReactNode, maxWidth?: 'md') =>
  render(
    <ThemeProvider theme={createTheme(maxWidth ? { components: { Dialog: { defaultProps: { maxWidth } } } } : {})}>
      {children}
    </ThemeProvider>,
  )

const openMore = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'More', hidden: true }))
  return screen.findByRole('menu', { name: 'More' })
}

const xs = 'min(444px, calc(100% - var(--kyro-space-lg) * 2))'
const md = 'min(900px, calc(100% - var(--kyro-space-lg) * 2))'

describe('the More menu', () => {
  test('shows each item’s label alone when no tooltip prop is passed', async () => {
    themed(<Table />)
    const menu = await openMore()

    expect(Array.from(menu.querySelectorAll('[role^=menuitem]')).map((item) => item.textContent)).toEqual([
      'Import',
      'Export',
      'Settings',
    ])
  })

  test('adds the tooltip text as a second line when the prop is passed', async () => {
    themed(<Table tooltips />)
    const menu = await openMore()

    expect(within(menu).getByText('From a CSV file')).toBeDefined()
    expect(within(menu).getByText('Everything shown')).toBeDefined()
  })
})

describe('the dialogs the table opens', () => {
  const openSettings = async () => {
    fireEvent.click(within(await openMore()).getByRole('menuitem', { name: 'Settings' }))
    return screen.findByRole('dialog', { name: 'Settings' })
  }

  test('Settings uses the standard dialog header and is full width at xs when the theme sets nothing', async () => {
    themed(<Table />)
    const dialog = await openSettings()

    expect(within(dialog).getByRole('heading', { name: 'Settings' })).toBeDefined()
    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeDefined()
    expect(dialog.style.width).toBe('100%')
    expect(dialog.style.maxWidth).toBe(xs)
  })

  test('Settings follows the theme’s Dialog maxWidth', async () => {
    themed(<Table />, 'md')

    expect((await openSettings()).style.maxWidth).toBe(md)
  })

  test('Manage views uses the standard header and the same width', async () => {
    themed(<Table />)
    fireEvent.click(within(await openSettings()).getByText('Manage views'))
    const dialog = await screen.findByRole('dialog', { name: 'Views' })

    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeDefined()
    expect(dialog.style.width).toBe('100%')
    expect(dialog.style.maxWidth).toBe(xs)
  })

  test('the bulk-action confirmation uses the standard header and the same width', async () => {
    themed(<Table selected />)
    fireEvent.click(await screen.findByRole('button', { name: /Actions/, hidden: true }))
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Delete' }))
    const dialog = await screen.findByRole('dialog', { name: 'Delete 1?' })

    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeDefined()
    expect(dialog.style.width).toBe('100%')
    expect(dialog.style.maxWidth).toBe(xs)
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeDefined())
  })
})
