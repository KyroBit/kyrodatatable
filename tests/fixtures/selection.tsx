import '@kyrobit/kyroui/styles.css'
import { ThemeProvider } from '@kyrobit/kyroui'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client'
import { useDataTable, type FetchResult } from '../../src/index.js'
import { DataTable as KyroDataTable } from '../../src/renderers/kyroui/index.js'
import { DataTable as MuiDataTable } from '../../src/renderers/mui/index.js'

interface Item {
  id: string
  name: string
  note: string
  amount: number
}

const params = new URLSearchParams(location.search)
const renderer = params.get('renderer')
const widths = params.get('widths') === 'explicit'
const loading = params.get('loading') === '1'

const data: Item[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Customer ${index + 1}`,
  note: 'A long note that keeps going so the column wants far more room than it should ever get '.repeat(2),
  amount: index * 1234,
}))

function Page() {
  const api = useDataTable<Item, keyof Item & string>({
    fetchRecords: () => (loading ? new Promise<FetchResult<Item>>(() => {}) : Promise.resolve({ rows: data, total: data.length })),
    columns: [
      { field: 'name', headerName: 'Name', width: widths ? '30%' : undefined },
      { field: 'note', headerName: 'Note' },
      { field: 'amount', headerName: 'Amount', align: 'right' },
    ],
    getRowId: (row) => row.id,
  })
  const table = renderer === 'mui' ? <MuiDataTable api={api} selectable /> : <KyroDataTable api={api} selectable />
  return <div style={{ height: '100vh', boxSizing: 'border-box', padding: 16, display: 'flex', flexDirection: 'column' }}>{table}</div>
}

createRoot(document.getElementById('root')!).render(
  renderer === 'mui' ? (
    <MuiThemeProvider theme={createTheme()}>
      <Page />
    </MuiThemeProvider>
  ) : (
    <ThemeProvider mode="light">
      <Page />
    </ThemeProvider>
  ),
)
