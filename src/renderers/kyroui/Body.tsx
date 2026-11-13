import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { useVirtualizer, useWindowVirtualizer, type Rect, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual'
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
function GroupPager({ groupId, api }: { groupId: string; api: DataTableApi<unknown, string, undefined> }) {
  const pagination = api.groupPagination(groupId)
  const total = api.groupTotal(groupId)
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
        onClick={() => api.setGroupPage(groupId, pagination.page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        disabled={to >= total}
        onClick={() => api.setGroupPage(groupId, pagination.page + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

const SKELETON_ROWS = 10
const LOADING_MORE_ROWS = 3
const ESTIMATED_ROW_HEIGHT = 41
const OVERSCAN = 10
const ROW_INTENT_DELAY = 80
const SKELETON_DELAY = 150

interface View {
  top: number
  rect: Rect
  rows: VirtualItem[]
  margin: number
}

interface Snapshot {
  rows: VirtualItem[]
  margin: number
}

type Scroller = HTMLElement | Window

type Windowing = Pick<Virtualizer<Scroller, Element>, 'takeSnapshot' | 'getVirtualItems' | 'getTotalSize' | 'measureElement'>

const views = new Map<string, View>()

const scrollParentOf = (node: HTMLElement): Scroller => {
  for (let el = node.parentElement; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    if (/auto|scroll|overlay/.test(getComputedStyle(el).overflowY)) return el
  }
  return window
}

const offsetOf = (scroller: Scroller) => (scroller instanceof Window ? scroller.scrollY : scroller.scrollTop)

const rectOf = (scroller: Scroller): Rect =>
  scroller instanceof Window
    ? { width: scroller.innerWidth, height: scroller.innerHeight }
    : { width: scroller.clientWidth, height: scroller.clientHeight }

const marginOf = (node: HTMLElement, scroller: Scroller) =>
  node.getBoundingClientRect().top + offsetOf(scroller) -
  (scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top + scroller.clientTop)

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
  pageScroll?: boolean
  restoreScroll?: boolean
  stickyTop?: string
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
  pageScroll = false,
  restoreScroll = true,
  stickyTop,
}: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0)
  const fetching = api.loading || api.groupsLoading
  const hasExplicitWidths = api.visibleColumns.some((col) => col.width)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scroller, setScroller] = useState<Scroller | null>(null)
  const [rowHeight, setRowHeight] = useState(0)
  const columnsKey = api.visibleColumns.map((col) => col.field).join('|')
  const [locked, setLocked] = useState<{ key: string; widths: string[] } | null>(null)
  const lockedWidths = locked?.key === columnsKey ? locked.widths : null
  const intentTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const viewKey = api.cacheKey === undefined || !restoreScroll ? null : api.listKey
  const view = viewKey === null ? undefined : views.get(viewKey)
  const snapshot = useRef<() => Snapshot>(() => ({ rows: [], margin: 0 }))

  useEffect(() => () => clearTimeout(intentTimer.current), [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const next = pageScroll ? scrollParentOf(container) : container
    if (next !== scroller) setScroller(next)
  })

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const target = pageScroll ? scrollParentOf(container) : container
    const edge = target instanceof Window ? 0 : target.getBoundingClientRect().top
    const pin = container.querySelector('thead th')?.getBoundingClientRect().top ?? edge
    const passed = container.getBoundingClientRect().top < Math.max(edge, pin) - 1
    if (view) target.scrollTo({ top: view.top, behavior: 'instant' })
    else if (!pageScroll) container.scrollTop = 0
    else if (passed) container.scrollIntoView({ block: 'start', behavior: 'instant' })
    return () => {
      if (viewKey === null) return
      views.set(viewKey, { top: offsetOf(target), rect: rectOf(target), ...snapshot.current() })
    }
  }, [api.listKey, api.groupBy])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rows = Array.from(container.querySelectorAll('tbody tr[data-row]'))
    const tallest = Math.max(0, ...rows.map((row) => row.getBoundingClientRect().height))
    if (tallest > rowHeight) setRowHeight(tallest)
    if (hasExplicitWidths || lockedWidths || !rows.length) return
    const table = container.querySelector('table')!.getBoundingClientRect().width
    const cells = Array.from(container.querySelectorAll('thead th')).slice(selectable ? 1 : 0)
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
          key={`group-${item.id}`}
          data-row=""
          {...measured}
          className="KyroTable-groupRow"
          onClick={() => api.toggleGroup(item.id)}
          style={{ cursor: 'pointer' }}
        >
          <TableCell className="KyroTable-groupCell" colSpan={colSpan}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'sm', pl: item.depth * 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'sm', minWidth: 0 }}>
                {item.expanded
                  ? <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  : <ChevronRightIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                {selectable && (
                  <Box component="span" sx={{ display: 'inline-flex' }} onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}>
                    <Checkbox
                      checked={api.groupAllSelected(item.id)}
                      indeterminate={api.groupSomeSelected(item.id) && !api.groupAllSelected(item.id)}
                      onChange={() => api.toggleSelectGroup(item.id)}
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
                    bgcolor: 'action.hover', color: 'text.secondary',
                  }}
                >
                  {item.group.count}
                </Box>
                {api.groupLoading(item.id) && api.groupRows(item.id).length === 0 && (
                  <Box component="span" sx={{ color: 'text.secondary', fontSize: 'sm' }}>loading…</Box>
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
          <TableCell padding="checkbox" onClick={(e: MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}>
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

  const rowsProps: RowsProps = {
    count: items.length,
    body: () => containerRef.current?.querySelector('tbody') ?? null,
    view,
    snapshot,
    rowHeight: rowHeight || ESTIMATED_ROW_HEIGHT,
    colSpan,
    render: renderItem,
  }

  return (
    <TableContainer
      ref={containerRef}
      data-scroll-root={pageScroll ? undefined : ""}
      sx={(theme) => (pageScroll
        ? { overflow: 'visible', scrollMarginTop: stickyTop }
        : { flex: '1 1 0', minHeight: `calc(${theme.vars.size.row} * 4)`, overflowY: 'auto', contain: 'size' })}
    >
      <Table
        size="small"
        stickyHeader={stickyHeader}
        sx={{ ...(fixedWidths && { tableLayout: 'fixed' }), ...(stickyTop && { '& thead th': { top: stickyTop } }) }}
      >
        {hasExplicitWidths ? (
          <colgroup>
            {selectable && <col />}
            {api.visibleColumns.map((col) => (
              <col key={col.field} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
        ) : lockedWidths ? (
          <colgroup>
            {selectable && <col />}
            {lockedWidths.map((width, index) => <col key={index} style={{ width }} />)}
          </colgroup>
        ) : null}
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell variant="head" padding="checkbox">
                <Checkbox
                  checked={api.allSelected}
                  indeterminate={api.someSelected && !api.allSelected}
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
              scroller && (
                scroller instanceof Window ? (
                  <WindowRows {...rowsProps} />
                ) : (
                  <ElementRows scroller={scroller} {...rowsProps} />
                )
              )
            ) : (
              items.map((_, index) => renderItem(index))
            )
          )}
          {infiniteScroll && api.hasMore && scroller && <ScrollEnd scroller={scroller} colSpan={colSpan} selectable={selectable} />}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface RowsProps {
  count: number
  body: () => HTMLElement | null
  view: View | undefined
  snapshot: RefObject<() => Snapshot>
  rowHeight: number
  colSpan: number
  render: (index: number, measure: (row: HTMLTableRowElement | null) => void) => ReactNode
}

function useMargin(body: () => HTMLElement | null, scroller: Scroller, initial: number) {
  const [margin, setMargin] = useState(initial)
  useLayoutEffect(() => {
    const node = body()
    if (!node) return
    const next = marginOf(node, scroller)
    if (Math.abs(next - margin) > 0.5) setMargin(next)
  })
  return margin
}

const virtualOptions = (props: RowsProps, scroller: Scroller, margin: number) => ({
  count: props.count,
  initialOffset: props.view?.top ?? offsetOf(scroller),
  initialRect: props.view?.rect ?? rectOf(scroller),
  initialMeasurementsCache: props.view?.rows,
  estimateSize: () => props.rowHeight,
  overscan: OVERSCAN,
  scrollMargin: margin,
})

function ElementRows({ scroller, ...props }: RowsProps & { scroller: HTMLElement }) {
  'use no memo'
  const margin = useMargin(props.body, scroller, props.view?.margin ?? 0)
  const virtualizer = useVirtualizer({ ...virtualOptions(props, scroller, margin), getScrollElement: () => scroller })
  return <Windowed virtualizer={virtualizer} margin={margin} {...props} />
}

function WindowRows(props: RowsProps) {
  'use no memo'
  const margin = useMargin(props.body, window, props.view?.margin ?? 0)
  const virtualizer = useWindowVirtualizer(virtualOptions(props, window, margin))
  return <Windowed virtualizer={virtualizer} margin={margin} {...props} />
}

/** Only the rows in view, plus a margin, are in the document; spacer rows stand in for the rest so the scrollbar stays true. */
function Windowed({ virtualizer, margin, snapshot, colSpan, render }: RowsProps & { virtualizer: Windowing; margin: number }) {
  'use no memo'
  snapshot.current = () => ({ rows: virtualizer.takeSnapshot(), margin })
  const windowed = virtualizer.getVirtualItems()
  const above = windowed.length ? windowed[0]!.start - margin : 0
  const below = virtualizer.getTotalSize() - (windowed.length ? windowed.at(-1)!.end - margin : 0)
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
      {selectable && <TableCell padding="checkbox" />}
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

function ScrollEnd({ scroller, colSpan, selectable }: { scroller: Scroller; colSpan: number; selectable: boolean }) {
  const api = useDataTableContext()
  const marker = useRef<HTMLTableRowElement>(null)
  const [reached, setReached] = useState(false)
  const { loadMore, loadingMore, rows } = api

  useEffect(() => {
    const node = marker.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && loadMore(), {
      root: scroller instanceof Window ? null : scroller,
      rootMargin: `0px 0px ${rectOf(scroller).height}px 0px`,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore, rows.length, scroller])

  useEffect(() => {
    const node = marker.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setReached(Boolean(entry?.isIntersecting)), {
      root: scroller instanceof Window ? null : scroller,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [scroller])

  return (
    <>
      <tr ref={marker} aria-hidden="true">
        <td colSpan={colSpan} style={{ padding: 0, height: 1, border: 0 }} />
      </tr>
      {reached && loadingMore && <SkeletonRows count={LOADING_MORE_ROWS} selectable={selectable} />}
    </>
  )
}
