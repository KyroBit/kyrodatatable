import { describe, expect, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useDataTable } from '../src/index.js'
import { DataTable } from '../src/renderers/mui/index.js'

interface Item {
  id: string
  name: string
}

const data: Item[] = [{ id: '1', name: 'One' }]

function Everything({ tooltips = false }: { tooltips?: boolean }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data,
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  return (
    <DataTable
      api={api}
      onImport={() => {}}
      onExport={() => {}}
      {...(tooltips ? { importTooltip: 'From a CSV file', exportTooltip: 'Everything shown' } : {})}
    />
  )
}

test('the MUI toolbar shows Import, then Export, then Settings', () => {
  render(<Everything />)

  const order = ['Import', 'Export', 'Settings'].map((name) => screen.getByRole('button', { name: new RegExp(`^${name}`) }))
  const positions = order.map((button) => Array.from(document.querySelectorAll('button')).indexOf(button as HTMLButtonElement))

  expect(positions).toEqual([...positions].sort((a, b) => a - b))
})

describe('MUI toolbar tooltips', () => {
  test('are absent unless a tooltip prop is passed', () => {
    render(<Everything />)

    expect(document.querySelector('[aria-label="Import from CSV"], [aria-label="Export current results"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'Import' }).closest('[aria-label]')).toBeNull()
  })

  test('appear when the prop is passed', () => {
    render(<Everything tooltips />)

    expect(document.querySelector('[aria-label="From a CSV file"]')).not.toBeNull()
    expect(document.querySelector('[aria-label="Everything shown"]')).not.toBeNull()
  })
})

describe('MUI dialogs', () => {
  const openSettings = async () => {
    fireEvent.click(screen.getByRole('button', { name: /^Settings/ }))
    return (await screen.findByRole('dialog')).closest('.MuiDialog-paper') ?? (await screen.findByRole('dialog'))
  }

  test('Settings is full width at xs when the MUI theme sets no Dialog defaults', async () => {
    render(<Everything />)
    const paper = await openSettings()

    expect(paper.className).toContain('MuiDialog-paperFullWidth')
    expect(paper.className).toContain('MuiDialog-paperWidthXs')
  })

  test('Settings follows the MUI theme’s Dialog defaults', async () => {
    render(
      <ThemeProvider theme={createTheme({ components: { MuiDialog: { defaultProps: { maxWidth: 'md', fullWidth: false } } } })}>
        <Everything />
      </ThemeProvider>,
    )
    const paper = await openSettings()

    expect(paper.className).toContain('MuiDialog-paperWidthMd')
    expect(paper.className).not.toContain('MuiDialog-paperFullWidth')
  })
})
