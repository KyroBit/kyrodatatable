import type { ReactNode } from 'react'
import {
  Box, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { useDataTableContext } from './context.js'
import type { DataTableApi } from '../../state/useDataTable.js'
import type { SortDirection } from '../../types/index.js'

/**
 * Stacked up/down triangles — the "double arrow" sort indicator modern apps
 * use. Both grey when the column is unsorted; the active direction darkens.
 */
function SortArrows({ direction }: { direction: SortDirection | null }) {
  const fill = (dir: SortDirection) => (direction === dir ? 'text.primary' : 'action.disabled')
  return (
    <Box
      component="span"
      className="KyroTable-sortArrows"
      sx={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', ml: 0.75, flex: 'none' }}
    >
      <Box component="svg" width={8} height={5} viewBox="0 0 8 5" sx={{ display: 'block', color: fill('asc'), transition: 'color 0.15s' }}>
        <path d="M4 0 L7.6 4.6 H0.4 Z" fill="currentColor" />
      </Box>
      <Box component="svg" width={8} height={5} viewBox="0 0 8 5" sx={{ display: 'block', color: fill('desc'), transition: 'color 0.15s' }}>
        <path d="M4 5 L7.6 0.4 H0.4 Z" fill="currentColor" />
      </Box>
    </Box>
  )
}

/**
 * Compact inline pager shown at the right edge of an expanded group's header
 * row — each group paginates independently (`api.setGroupPage`).
 */
function GroupPager({ groupKey, api }: { groupKey: string; api: DataTableApi<unknown> }) {
  const pagination = api.groupPagination(groupKey)
  const total = api.groupTotal(groupKey)
  if (total <= 0) return null

  const from = (pagination.page - 1) * pagination.pageSize + 1
  const to = Math.min(pagination.page * pagination.pageSize, total)

  return (
    <Box
      className="KyroTable-groupPager"
      onClick={(e) => e.stopPropagation()}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flex: 'none' }}
    >
      <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', mr: 0.5 }}>
        {from}–{to} of {total}
      </Typography>
      <IconButton
        size="small"
        disabled={pagination.page <= 1}
        onClick={() => api.setGroupPage(groupKey, pagination.page - 1)}
        aria-label="Previous page"
      >
        <KeyboardArrowLeftIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton
        size="small"
        disabled={to >= total}
        onClick={() => api.setGroupPage(groupKey, pagination.page + 1)}
        aria-label="Next page"
      >
        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  )
}

export interface DataTableBodyProps<Row> {
  onRowClick?: (row: Row) => void
  emptyMessage?: string
  /** Renders a leading checkbox column wired to `api.selection`. */
  selectable?: boolean
  /** Keeps the header row visible while rows scroll inside the container. Default `true`. */
  stickyHeader?: boolean
}

/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody<Row>({
  onRowClick, emptyMessage = 'No records found.', selectable = false, stickyHeader = true,
}: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.columns.length + (selectable ? 1 : 0)
  const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading

  return (
    <TableContainer sx={{ flex: '1 1 auto', minHeight: 0 }}>
      <Table size="small" stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={api.allVisibleSelected}
                  indeterminate={api.someVisibleSelected && !api.allVisibleSelected}
                  onChange={() => api.toggleSelectAll()}
                  slotProps={{ input: { 'aria-label': 'Select all rows' } }}
                />
              </TableCell>
            )}
            {api.columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align}
                sortDirection={api.sort?.field === col.field ? api.sort.direction : false}
                onClick={col.sortable === false ? undefined : () => api.toggleSort(col.field)}
                sx={col.sortable === false ? undefined : {
                  cursor: 'pointer',
                  userSelect: 'none',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {col.sortable === false ? col.headerName : (
                  <Box
                    component="button"
                    type="button"
                    className="KyroTable-sortButton"
                    sx={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      margin: 0,
                      font: 'inherit',
                      textTransform: 'inherit',
                      letterSpacing: 'inherit',
                      color: 'inherit',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {col.headerName}
                    <SortArrows direction={api.sort?.field === col.field ? api.sort.direction : null} />
                  </Box>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              if (item.type === 'group') {
                return (
                  <TableRow
                    key={`group-${item.group.key}`}
                    className="KyroTable-groupRow"
                    onClick={() => api.toggleGroup(item.group.key)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell className="KyroTable-groupCell" colSpan={colSpan}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                          {item.expanded
                            ? <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            : <KeyboardArrowRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                          {selectable && item.expanded && (
                            <Checkbox
                              size="small"
                              sx={{ p: 0.25, ml: -0.5 }}
                              onClick={(e) => e.stopPropagation()}
                              checked={api.groupAllSelected(item.group.key)}
                              indeterminate={api.groupSomeSelected(item.group.key) && !api.groupAllSelected(item.group.key)}
                              onChange={() => api.toggleSelectGroup(item.group.key)}
                              slotProps={{ input: { 'aria-label': `Select all rows in ${item.group.label}` } }}
                            />
                          )}
                          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 600, color: 'text.primary' }}>
                            {item.group.label}
                          </Typography>
                          <Box
                            component="span"
                            className="KyroTable-groupCount"
                            sx={{
                              fontSize: 12, fontWeight: 600, lineHeight: 1,
                              px: 1, py: '3px', borderRadius: 999,
                              bgcolor: 'action.selected', color: 'text.secondary',
                            }}
                          >
                            {item.group.count}
                          </Box>
                          {api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (
                            <Box component="span" sx={{ color: 'text.secondary', fontSize: 12 }}>loading…</Box>
                          )}
                        </Box>
                        {item.expanded && <GroupPager groupKey={item.group.key} api={api as DataTableApi<unknown>} />}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              }
              const row = item.row
              const rowId = api.getRowId(row)
              return (
                <TableRow
                  key={rowId}
                  hover
                  selected={selectable && api.isSelected(rowId)}
                  className={item.type === 'group-row' ? 'KyroTable-groupChildRow' : undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : undefined }}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={api.isSelected(rowId)}
                        onChange={() => api.toggleSelected(rowId)}
                        slotProps={{ input: { 'aria-label': 'Select row' } }}
                      />
                    </TableCell>
                  )}
                  {api.columns.map((col) => (
                    <TableCell key={col.field} align={col.align}>
                      {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
