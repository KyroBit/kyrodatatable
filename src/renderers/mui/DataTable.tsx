import { Box } from '@mui/material'
import type { DataTableApi } from '../../state/useDataTable.js'
import { DataTableRoot } from './context.js'
import { DataTableSearchField } from './SearchField.js'
import { DataTableGroupBySelect } from './GroupBySelect.js'
import { DataTableBody } from './Body.js'
import { DataTablePagination } from './Pagination.js'

export interface DataTableProps<Row, Field extends string = string, Filters = undefined> {
  api: DataTableApi<Row, Field, Filters>
  onRowClick?: (row: Row) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

/**
 * The default assembly: search + group-by select, the table, pagination.
 * Covers most screens as-is. For a different layout — preset tabs, a custom
 * sort menu, import/export buttons — compose the same pieces yourself:
 * `DataTable.Root`, `.SearchField`, `.GroupBySelect`, `.Body`, `.Pagination`.
 */
export function DataTable<Row, Field extends string = string, Filters = undefined>({
  api, onRowClick, searchPlaceholder, emptyMessage,
}: DataTableProps<Row, Field, Filters>) {
  return (
    <DataTableRoot api={api}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <DataTableSearchField placeholder={searchPlaceholder} />
          <DataTableGroupBySelect />
        </Box>
        <DataTableBody<Row> onRowClick={onRowClick} emptyMessage={emptyMessage} />
        <DataTablePagination />
      </Box>
    </DataTableRoot>
  )
}

DataTable.Root = DataTableRoot
DataTable.SearchField = DataTableSearchField
DataTable.GroupBySelect = DataTableGroupBySelect
DataTable.Body = DataTableBody
DataTable.Pagination = DataTablePagination
