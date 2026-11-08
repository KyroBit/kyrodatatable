import { TablePagination } from '@mui/material'
import { useDataTableContext } from './context.js'

export interface DataTablePaginationProps {
  /** Page-size choices. Empty (the default) hides the rows-per-page select entirely. */
  rowsPerPageOptions?: number[]
  groupsPerPageOptions?: number[]
}

export function DataTablePagination({ rowsPerPageOptions = [], groupsPerPageOptions = [] }: DataTablePaginationProps) {
  const api = useDataTableContext()
  const grouped = api.groupBy.length > 0
  const count = grouped ? api.groupsTotal : api.total

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={grouped ? groupsPerPageOptions : rowsPerPageOptions}
      labelRowsPerPage={grouped ? 'Groups per page:' : 'Rows per page:'}
      count={count}
      page={api.pagination.page - 1}
      rowsPerPage={grouped ? api.groupPageSize : api.pagination.pageSize}
      onPageChange={(_, page) => api.setPage(page + 1)}
      onRowsPerPageChange={(e) => (grouped ? api.setGroupPageSize : api.setPageSize)(Number(e.target.value))}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
      sx={{ visibility: count === 0 ? 'hidden' : undefined }}
    />
  )
}
