import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Box, Button, Checkbox, IconButton, Skeleton, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography,
} from '@kyrobit/kyroui'
import { useDataTableContext } from './context.js'
import { ChevronLeftIcon, ChevronRightIcon, ExpandMoreIcon } from './icons.js'
import { countFilterValues } from '@kyrobit/datatable'
import type { DataTableApi, FilterValues, SortDirection } from '@kyrobit/datatable'

/**
 * Stacked up/down triangles — the "double arrow" sort indicator modern apps
 * use. Both grey when the column is unsorted; the active direction darkens.
 */
function SortChevron({ points, active }: { points: string; active: boolean }) {
  return (
    <SvgIcon
      width={11}
      height={7}
      viewBox="0 0 24 14"
      sx={(theme) => ({
        display: 'block',
        fill: 'none',
        color: active ? 'text.primary' : 'text.disabled',
        transition: theme.transitions.create('color', { duration: theme.transitions.duration.shortest }),
      })}
    >
      <path
        d={points}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

function SortArrows({ direction }: { direction: SortDirection | null }) {
  return (
    <Box
      component="span"
      className="KyroTable-sortArrows"
      sx={{ display: 'inline-flex', flexDirection: 'column', ml: 'xs', flex: 'none' }}
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
function GroupPager({ groupKey, api }: { groupKey: string; api: DataTableApi<unknown, string, undefined> }) {
  const pagination = api.groupPagination(groupKey)
  const total = api.groupTotal(groupKey)
  if (total <= 0) return null

  const from = (pagination.page - 1) * pagination.pageSize + 1
  const to = Math.min(pagination.page * pagination.pageSize, total)

  return (
    <Box
      className="KyroTable-groupPager"
      onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}
      sx={{ display: 'flex', alignItems: 'center', gap: 'xs', flex: 'none' }}
    >
      <Typography component="span" sx={{ fontSize: 'sm', color: 'text.secondary', fontVariantNumeric: 'tabular-nums', mr: 'xs' }}>
        {from}–{to} of {total}
      </Typography>
      <IconButton
        size="small"
        disabled={pagination.page <= 1}
        onClick={() => api.setGroupPage(groupKey, pagination.page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        disabled={to >= total}
        onClick={() => api.setGroupPage(groupKey, pagination.page + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

const SKELETON_ROWS = 10
const LOADING_MORE_ROWS = 3
const SCROLL_END_THRESHOLD = 80
const ESTIMATED_ROW_HEIGHT = 41
const OVERSCAN = 10
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
  /** Scrolls rows inside a bounded box and loads the next page near its end, in place of page controls. */
  infiniteScroll?: boolean
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
  infiniteScroll = false,
}: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0)
  const fetching = api.loading || api.groupsLoading
  const hasExplicitWidths = api.visibleColumns.some((col) => col.width)
  const containerRef = useRef<HTMLDivElement>(null)
  const [rowHeight, setRowHeight] = useState(0)
  const [headHeight, setHeadHeight] = useState(0)
  const columnsKey = api.visibleColumns.map((col) => col.field).join('|')
  const [locked, setLocked] = useState<{ key: string; widths: string[] } | null>(null)
  const lockedWidths = locked?.key === columnsKey ? locked.widths : null
  const intentTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(intentTimer.current), [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const head = container.querySelector('thead')?.getBoundingClientRect().height ?? 0
    const rows = Array.from(container.querySelectorAll('tbody tr[data-row]'))
    const tallest = Math.max(0, ...rows.map((row) => row.getBoundingClientRect().height))
    if (head > headHeight) setHeadHeight(head)
    if (tallest > rowHeight) setRowHeight(tallest)
    if (hasExplicitWidths || lockedWidths || !rows.length) return
    const table = container.querySelector('table')!.getBoundingClientRect().width
    const cells = Array.from(container.querySelectorAll('thead th'))
    setLocked({
      key: columnsKey,
      widths: cells.map((cell) => `${(cell.getBoundingClientRect().width / table) * 100}%`),
    })
  })

  const fixedWidths = hasExplicitWidths || lockedWidths !== null

  // An empty message describes a finished result, so it never stands in for one still loading:
  // a list with rows keeps them while the next page arrives, an empty one shows placeholders.
  if (items.length === 0 && !fetching) {
    const filtered = Boolean(api.search) || countFilterValues((api.filters ?? {}) as FilterValues) > 0
    const message = api.error
      ? (errorMessage ?? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'md', py: 'xl' }}>
            <Typography sx={{ color: 'text.secondary' }}>These records could not be loaded.</Typography>
            <Button variant="outlined" onClick={() => api.refetch()}>Try again</Button>
          </Box>
        ))
      : filtered ? noResultsMessage : emptyMessage

    return (
      <Box className="KyroTable-empty" sx={{ flex: 1, py: 'xl' }}>
        {typeof message === 'string'
          ? <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 'xl' }}>{message}</Typography>
          : message}
      </Box>
    )
  }

  const renderItem = (index: number, measure?: (row: HTMLTableRowElement | null) => void) => {
    const item = items[index]!
    const measured = measure ? { 'data-index': index, ref: measure } : {}
    if (item.type === 'group') {
      return (
        <TableRow
          key={`group-${item.group.key}`}
          data-row=""
          {...measured}
          className="KyroTable-groupRow"
          onClick={() => api.toggleGroup(item.group.key)}
          style={{ cursor: 'pointer' }}
        >
          <TableCell className="KyroTable-groupCell" colSpan={colSpan}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'sm' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'sm', minWidth: 0 }}>
                {item.expanded
                  ? <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  : <ChevronRightIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                {selectable && item.expanded && (
                  <Box component="span" sx={{ display: 'inline-flex' }} onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}>
                    <Checkbox
                      checked={api.groupAllSelected(item.group.key)}
                      indeterminate={api.groupSomeSelected(item.group.key) && !api.groupAllSelected(item.group.key)}
                      onChange={() => api.toggleSelectGroup(item.group.key)}
                      aria-label={`Select all rows in ${item.group.label}`}
                    />
                  </Box>
                )}
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.group.label}
                </Box>
                <Box
                  component="span"
                  className="KyroTable-groupCount"
                  sx={{
                    fontSize: 'sm', fontWeight: 600, lineHeight: 1,
                    px: 'sm', py: 'xs', borderRadius: 'pill',
                    bgcolor: 'background.surfaceHover', color: 'text.secondary',
                  }}
                >
                  {item.group.count}
                </Box>
                {api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (
                  <Box component="span" sx={{ color: 'text.secondary', fontSize: 'sm' }}>loading…</Box>
                )}
              </Box>
              {item.expanded && <GroupPager groupKey={item.group.key} api={api as DataTableApi<unknown, string, undefined>} />}
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
        data-row=""
        {...measured}
        hover
        selected={selectable && api.isSelected(rowId)}
        className={classes || undefined}
        style={{ cursor: onRowClick ? 'pointer' : undefined }}
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
          <TableCell onClick={(e: MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}>
            <Checkbox
              checked={api.isSelected(rowId)}
              onChange={() => api.toggleSelected(rowId)}
              aria-label="Select row"
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
  }

  return (
    <TableContainer
      ref={containerRef}
      data-scroll-root=""
      sx={(theme) => ({ flex: '1 1 0', minHeight: `calc(${theme.vars.size.row} * 4)`, overflowY: 'auto', contain: 'size' })}
    >
      <Table size="small" stickyHeader={stickyHeader} sx={fixedWidths ? { tableLayout: 'fixed' } : undefined}>
        {hasExplicitWidths ? (
          <colgroup>
            {selectable && <col style={{ width: 48 }} />}
            {api.visibleColumns.map((col) => (
              <col key={col.field} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
        ) : lockedWidths ? (
          <colgroup>
            {lockedWidths.map((width, index) => <col key={index} style={{ width }} />)}
          </colgroup>
        ) : null}
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell variant="head">
                <Checkbox
                  checked={api.allVisibleSelected}
                  indeterminate={api.someVisibleSelected && !api.allVisibleSelected}
                  onChange={() => api.toggleSelectAll()}
                  aria-label="Select all rows"
                />
              </TableCell>
            )}
            {api.visibleColumns.map((col) => (
              <TableCell
                key={col.field}
                variant="head"
                align={col.align}
                sortDirection={api.sort?.field === col.field ? api.sort.direction : false}
                onClick={col.sortable === false ? undefined : () => api.toggleSort(col.field)}
                sx={col.sortable === false ? undefined : { cursor: 'pointer', userSelect: 'none' }}
              >
                {col.sortable === false ? col.headerName : (
                  <button
                    type="button"
                    className="KyroTable-sortButton"
                    style={{
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
                    }}
                  >
                    {col.headerName}
                    <SortArrows direction={api.sort?.field === col.field ? api.sort.direction : null} />
                  </button>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <SkeletonRows count={Math.min(api.pagination.pageSize, SKELETON_ROWS)} selectable={selectable} />
          ) : (
            infiniteScroll ? (
              <VirtualRows
                count={items.length}
                scrollRef={containerRef}
                rowHeight={rowHeight || ESTIMATED_ROW_HEIGHT}
                offset={headHeight}
                colSpan={colSpan}
                render={renderItem}
              />
            ) : (
              items.map((_, index) => renderItem(index))
            )
          )}
          {infiniteScroll && api.loadingMore && <SkeletonRows count={LOADING_MORE_ROWS} selectable={selectable} />}
          {infiniteScroll && api.hasMore && !api.loadingMore && <ScrollEnd colSpan={colSpan} />}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface VirtualRowsProps {
  count: number
  scrollRef: RefObject<HTMLDivElement | null>
  rowHeight: number
  offset: number
  colSpan: number
  render: (index: number, measure: (row: HTMLTableRowElement | null) => void) => ReactNode
}

/** Only the rows in view, plus a margin, are in the document; spacer rows stand in for the rest so the scrollbar stays true. */
function VirtualRows({ count, scrollRef, rowHeight, offset, colSpan, render }: VirtualRowsProps) {
  'use no memo'
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN,
    scrollMargin: offset,
  })
  const windowed = virtualizer.getVirtualItems()
  const above = windowed.length ? windowed[0]!.start - offset : 0
  const below = windowed.length ? virtualizer.getTotalSize() - (windowed.at(-1)!.end - offset) : 0
  return (
    <>
      {above > 0 && <Spacer height={above} colSpan={colSpan} />}
      {windowed.map((entry) => render(entry.index, virtualizer.measureElement))}
      {below > 0 && <Spacer height={below} colSpan={colSpan} />}
    </>
  )
}

function Spacer({ height, colSpan }: { height: number; colSpan: number }) {
  return (
    <tr aria-hidden="true">
      <td colSpan={colSpan} style={{ height, padding: 0, border: 0 }} />
    </tr>
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
    <TableRow key={`skeleton-${index}`} className="KyroTable-skeletonRow">
      {selectable && <TableCell />}
      {api.visibleColumns.map((col) => (
        <TableCell key={col.field} align={col.align}>
          <Skeleton
            variant="rounded"
            sx={{ display: 'inline-block', width: '60%', maxWidth: 120, height: 12, borderRadius: 'pill' }}
          />
        </TableCell>
      ))}
    </TableRow>
  ))
}

/** An invisible last row; reaching within MUI's default 80px of it asks for the next page. Re-arms after each page, so one that still leaves it in view keeps loading. */
function ScrollEnd({ colSpan }: { colSpan: number }) {
  const api = useDataTableContext()
  const marker = useRef<HTMLTableRowElement>(null)
  const { loadMore, rows } = api

  useEffect(() => {
    const node = marker.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && loadMore(), {
      root: node.closest('[data-scroll-root]'),
      rootMargin: `0px 0px ${SCROLL_END_THRESHOLD}px 0px`,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore, rows.length])

  return (
    <tr ref={marker} aria-hidden="true">
      <td colSpan={colSpan} style={{ padding: 0, height: 1, border: 0 }} />
    </tr>
  )
}
