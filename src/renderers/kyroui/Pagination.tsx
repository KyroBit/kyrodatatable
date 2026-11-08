import { TablePagination } from '@kyrobit/kyroui'
import { useDataTableContext } from './context.js'

export interface DataTablePaginationProps {
  /** Page-size choices. Empty (the default) hides the rows-per-page select entirely. */
  rowsPerPageOptions?: number[]
}

export function DataTablePagination({ rowsPerPageOptions = [] }: DataTablePaginationProps) {
  const api = useDataTableContext()
  const count = api.groupBy.length > 0 ? api.groupsTotal : api.total

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      count={count}
      page={api.pagination.page - 1}
      rowsPerPage={api.pagination.pageSize}
      onPageChange={(_, page) => api.setPage(page + 1)}
      onRowsPerPageChange={(event) => api.setPageSize(Number(event.target.value))}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
      sx={{ flex: 1, visibility: count === 0 ? 'hidden' : undefined }}
    />
  )
}
