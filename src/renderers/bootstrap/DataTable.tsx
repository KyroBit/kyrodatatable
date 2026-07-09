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
 * Covers most screens as-is. For a different layout, compose the same
 * pieces yourself: `DataTable.Root`, `.SearchField`, `.GroupBySelect`, `.Body`, `.Pagination`.
 */
export function DataTable<Row, Field extends string = string, Filters = undefined>({
  api, onRowClick, searchPlaceholder, emptyMessage,
}: DataTableProps<Row, Field, Filters>) {
  return (
    <DataTableRoot api={api}>
      <div className="d-flex flex-column gap-3">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <DataTableSearchField placeholder={searchPlaceholder} />
          <DataTableGroupBySelect />
        </div>
        <DataTableBody<Row> onRowClick={onRowClick} emptyMessage={emptyMessage} />
        <DataTablePagination />
      </div>
    </DataTableRoot>
  )
}

DataTable.Root = DataTableRoot
DataTable.SearchField = DataTableSearchField
DataTable.GroupBySelect = DataTableGroupBySelect
DataTable.Body = DataTableBody
DataTable.Pagination = DataTablePagination
