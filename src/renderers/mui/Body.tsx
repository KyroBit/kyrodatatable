import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type ReactNode } from 'react'
import {
  Box, Button, Checkbox, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { useDataTableContext } from './context.js'
import { countFilterValues } from '@kyrobit/datatable'
import type { DataTableApi, FilterValues, SortDirection } from '@kyrobit/datatable'

/**
 * Stacked up/down triangles — the "double arrow" sort indicator modern apps
 * use. Both grey when the column is unsorted; the active direction darkens.
 */
function SortChevron({ points, active }: { points: string; active: boolean }) {
  return (
    <Box
      component="svg"
      width={11}
      height={7}
      viewBox="0 0 24 14"
      sx={{
        display: 'block',
        fill: 'none',
        color: active ? 'text.primary' : 'action.disabled',
        transition: 'color 0.15s',
      }}
    >
      <path
        d={points}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  )
}

function SortArrows({ direction }: { direction: SortDirection | null }) {
  return (
    <Box
      component="span"
      className="KyroTable-sortArrows"
      sx={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', ml: 0.75, flex: 'none' }}
    >
      <SortChevron points="M5 9.5 L12 3.5 L19 9.5" active={direction === 'asc'} />
      <SortChevron points="M5 4.5 L12 10.5 L19 4.5" active={direction === 'desc'} />
    </Box>
  )
}

/**
 * Compact inline pager shown at the right edge of an expanded group's header
 * row — each group paginates independently (`api.setGroupPage`).
 */
function GroupPager({ groupId, api }: { groupId: string; api: DataTableApi<unknown, string, undefined> }) {
  const pagination = api.groupPagination(groupId)
  const total = api.groupTotal(groupId)
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
        onClick={() => api.setGroupPage(groupId, pagination.page - 1)}
        aria-label="Previous page"
      >
        <KeyboardArrowLeftIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton
        size="small"
        disabled={to >= total}
        onClick={() => api.setGroupPage(groupId, pagination.page + 1)}
        aria-label="Next page"
      >
        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  )
}

const SKELETON_ROWS = 10
const ROW_INTENT_DELAY = 80
const SKELETON_DELAY = 150

export interface DataTableBodyProps<Row> {
  onRowClick?: (row: Row) => void
  onRowIntent?: (row: Row) => void
  /** Shown in place of the table when there are no records at all. */
  emptyMessage?: ReactNode
  /** Shown in place of the table when a search or filter matches nothing. */
  noResultsMessage?: ReactNode
  /** Shown in place of the table when the fetch fails. Defaults to a message with a retry button. */
  errorMessage?: ReactNode
  /** Renders a leading checkbox column wired to `api.selection`. */
  selectable?: boolean
  /** Keeps the header row visible while rows scroll inside the container. Default `true`. */
  stickyHeader?: boolean
  /** Extra class name(s) per data row. */
  rowClass?: (row: Row) => string
}

/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody<Row>({
  onRowClick,
  onRowIntent,
  emptyMessage = 'No records found.',
  noResultsMessage = 'No records match your search.',
  errorMessage,
  selectable = false,
  stickyHeader = true,
  rowClass,
}: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0)
  const fetching = api.loading || api.groupsLoading
  const hasExplicitWidths = api.visibleColumns.some((col) => col.width)
  const intentTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const { page, pageSize } = api.pagination

  useEffect(() => () => clearTimeout(intentTimer.current), [])

  useLayoutEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [page, pageSize, api.search, api.sort, api.filters, api.groupBy])

  // An empty message describes a finished result, so it never stands in for one still loading:
  // a list with rows keeps them while the next page arrives, an empty one shows placeholders.
  if (items.length === 0 && !fetching) {
    const filtered = Boolean(api.search) || countFilterValues((api.filters ?? {}) as FilterValues) > 0
    const message = api.error
      ? (errorMessage ?? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 6 }}>
            <Typography sx={{ color: 'text.secondary' }}>These records could not be loaded.</Typography>
            <Button variant="outlined" color="inherit" onClick={() => api.refetch()}>Try again</Button>
          </Box>
        ))
      : filtered ? noResultsMessage : emptyMessage

    return (
      <Box className="KyroTable-empty" sx={{ flex: '1 1 auto', py: 4 }}>
        {typeof message === 'string'
          ? <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>{message}</Typography>
          : message}
      </Box>
    )
  }

  return (
    <TableContainer ref={containerRef} sx={{ flex: '1 1 auto', minHeight: 0 }}>
      <Table size="small" stickyHeader={stickyHeader} sx={hasExplicitWidths ? { tableLayout: 'fixed' } : undefined}>
        {hasExplicitWidths && (
          <colgroup>
            {selectable && <col />}
            {api.visibleColumns.map((col) => (
              <col key={col.field} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
        )}
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
            {api.visibleColumns.map((col) => (
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
          {items.length === 0 ? (
            <SkeletonRows count={Math.min(api.pagination.pageSize, SKELETON_ROWS)} selectable={selectable} />
          ) : (
            items.map((item) => {
              if (item.type === 'group') {
                return (
                  <TableRow
                    key={`group-${item.id}`}
                    className="KyroTable-groupRow"
                    onClick={() => api.toggleGroup(item.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell className="KyroTable-groupCell" colSpan={colSpan}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, pl: item.depth * 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                          {item.expanded
                            ? <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            : <KeyboardArrowRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                          {selectable && item.expanded && (
                            <Checkbox
                              size="small"
                              sx={{ p: 0.25, ml: -0.5 }}
                              onClick={(e) => e.stopPropagation()}
                              checked={api.groupAllSelected(item.id)}
                              indeterminate={api.groupSomeSelected(item.id) && !api.groupAllSelected(item.id)}
                              onChange={() => api.toggleSelectGroup(item.id)}
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
                          {api.groupLoading(item.id) && api.groupRows(item.id).length === 0 && (
                            <Box component="span" sx={{ color: 'text.secondary', fontSize: 12 }}>loading…</Box>
                          )}
                        </Box>
                        {item.expanded && <GroupPager groupId={item.id} api={api as DataTableApi<unknown, string, undefined>} />}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              }
              const row = item.row
              const rowId = api.getRowId(row)
              const classes = [
                item.type === 'group-row' ? 'KyroTable-groupChildRow' : '',
                rowClass ? rowClass(row) : '',
              ].filter(Boolean).join(' ')
              return (
                <TableRow
                  key={rowId}
                  hover
                  selected={selectable && api.isSelected(rowId)}
                  className={classes || undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : undefined }}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowIntent ? 0 : undefined}
                  onPointerEnter={onRowIntent && (() => {
                    clearTimeout(intentTimer.current)
                    intentTimer.current = setTimeout(() => onRowIntent(row), ROW_INTENT_DELAY)
                  })}
                  onPointerLeave={onRowIntent && (() => clearTimeout(intentTimer.current))}
                  onFocus={onRowIntent && ((event: FocusEvent<HTMLTableRowElement>) => event.target === event.currentTarget && onRowIntent(row))}
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
                  {api.visibleColumns.map((col) => (
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

function SkeletonRows({ count, selectable }: { count: number; selectable: boolean }) {
  const api = useDataTableContext()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), SKELETON_DELAY)
    return () => clearTimeout(timer)
  }, [])

  if (!shown) return null
  return Array.from({ length: count }, (_, index) => (
    <TableRow key={index} className="KyroTable-skeletonRow">
      {selectable && <TableCell padding="checkbox" />}
      {api.visibleColumns.map((col) => (
        <TableCell key={col.field} align={col.align}>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ display: 'inline-block', width: '60%', maxWidth: 120, height: 12, borderRadius: 999 }}
          />
        </TableCell>
      ))}
    </TableRow>
  ))
}
