import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { createClientEngine } from './clientEngine.js'
import type {
  ColumnDef, DataTableConfig, FetchParams, FilterValues, GroupByColumn, PaginationState,
  ResourceGroup, SortState, VisibleItem,
} from '../types/index.js'

interface GroupRuntime<Row> {
  rows: Row[]
  total: number
  pagination: PaginationState
  loading: boolean
}

export interface DataTableApi<Row, Field extends string = string, Filters = FilterValues> {
  // echoed straight back from config, so a renderer only ever needs `api` — never a second copy of these
  columns: ColumnDef<Row, Field>[]
  getRowId: (row: Row) => string
  groupByColumns?: GroupByColumn<Field>[]

  /** `columns` minus the hidden ones, in the original order. What a renderer draws. */
  visibleColumns: ColumnDef<Row, Field>[]
  hiddenColumns: Field[]
  setColumnHidden: (field: Field, hidden: boolean) => void

  search: string
  setSearch: (value: string) => void

  filters: Filters | undefined
  setFilters: (filters: Filters) => void

  sort: SortState<Field> | null
  toggleSort: (field: Field) => void
  setSort: (sort: SortState<Field> | null) => void

  pagination: PaginationState
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void

  rows: Row[]
  total: number
  loading: boolean
  error: unknown

  /** Appends the next page to `rows` instead of replacing them, for scroll-to-load lists. A new search, sort or filter starts again from the first page. */
  loadMore: () => void
  /** More rows exist beyond those loaded. Always false while grouped. */
  hasMore: boolean
  loadingMore: boolean

  groupBy: Field | null
  setGroupBy: (field: Field | null) => void
  groups: ResourceGroup<Field>[]
  groupsTotal: number
  groupsLoading: boolean

  isGroupExpanded: (key: string) => boolean
  toggleGroup: (key: string) => void
  groupRows: (key: string) => Row[]
  groupTotal: (key: string) => number
  groupLoading: (key: string) => boolean
  groupPagination: (key: string) => PaginationState
  setGroupPage: (key: string, page: number) => void

  /** Flat + grouped rows in one display-ordered list — see the `VisibleItem` type. What every built-in renderer actually iterates. */
  visibleItems: VisibleItem<Row, Field>[]

  /** Row selection, keyed by row id. Persists across pages; collapsing a group drops its rows. */
  selection: Record<string, boolean>
  selectedIds: string[]
  isSelected: (id: string) => boolean
  toggleSelected: (id: string) => void
  setSelection: (selection: Record<string, boolean>) => void
  clearSelection: () => void
  /** Selects every currently visible row; if all are already selected, unselects them. */
  toggleSelectAll: () => void
  allVisibleSelected: boolean
  someVisibleSelected: boolean
  /** Per-group selection over the group's loaded rows. */
  groupAllSelected: (key: string) => boolean
  groupSomeSelected: (key: string) => boolean
  toggleSelectGroup: (key: string) => void

  refetch: () => void
}

const DEFAULT_PAGE_SIZE = 25

export function useDataTable<Row, Field extends string = string, Filters = FilterValues>(
  config: DataTableConfig<Row, Field, Filters>,
): DataTableApi<Row, Field, Filters> {
  const { columns, getRowId, groupByColumns, initialPageSize, initialSort, initialFilters, searchDebounceMs } = config

  const [hiddenColumns, setHiddenColumns] = useState<Field[]>(config.initialHiddenColumns ?? [])

  const setColumnHidden = (field: Field, hidden: boolean) => {
    setHiddenColumns((current) =>
      hidden ? (current.includes(field) ? current : [...current, field]) : current.filter((f) => f !== field),
    )
  }

  const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column.field))

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFiltersInternal] = useState<Filters | undefined>(initialFilters)
  const [sort, setSortInternal] = useState<SortState<Field> | null>(initialSort ?? null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize ?? DEFAULT_PAGE_SIZE,
  })

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  // The first fetch starts on mount, so the first render must already read as loading, or a
  // table flashes its empty state before the first page arrives.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [fetchTick, setFetchTick] = useState(0)
  const [loadedPage, setLoadedPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  /** Bumped by every fresh fetch, so a `loadMore` that lands after a new search is dropped instead of appended to the wrong list. */
  const generation = useRef(0)

  const [groupBy, setGroupByField] = useState<Field | null>(null)
  const [groups, setGroups] = useState<ResourceGroup<Field>[]>([])
  const [groupsTotal, setGroupsTotal] = useState(0)
  const [groupsLoading, setGroupsLoading] = useState(false)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [groupState, setGroupState] = useState<Record<string, GroupRuntime<Row>>>({})
  const [selection, setSelectionState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!searchDebounceMs) { setDebouncedSearch(search); return }
    const id = setTimeout(() => setDebouncedSearch(search), searchDebounceMs)
    return () => clearTimeout(id)
  }, [search, searchDebounceMs])

  const clientEngine = config.data
    ? createClientEngine<Row, Field, Filters>({
        data: config.data,
        columns,
        applyFilters: config.applyFilters,
        groupField: groupBy ? (row: Row) => (row as Record<string, unknown>)[groupBy] : undefined,
      })
    : null

  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups

  /**
   * A caller writing `fetchRecords={(p) => ...}` inline, or passing `data={rows ?? []}`, must not
   * re-trigger the fetch effects on identity alone. The query inputs decide when to fetch; the
   * functions are only how.
   */
  const fetchPage = useEffectEvent((params: FetchParams<Field, Filters>) => fetchRecords?.(params))
  const fetchGroupPage = useEffectEvent((params: FetchParams<Field, Filters>) => fetchGroups?.(params))

  const setFilters = (next: Filters) => {
    setFiltersInternal(next)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const setGroupBy = (field: Field | null) => {
    setGroupByField(field)
    setExpanded({})
    setGroupState({})
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const toggleSort = (field: Field) => {
    setSortInternal((current) => {
      if (!current || current.field !== field) return { field, direction: 'asc' }
      if (current.direction === 'asc') return { field, direction: 'desc' }
      return null
    })
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const setSort = (next: SortState<Field> | null) => {
    setSortInternal(next)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const setPage = (page: number) => {
    setPagination((p) => ({ ...p, page }))
  }

  const setPageSize = (pageSize: number) => {
    setPagination({ page: 1, pageSize })
  }

  const refetch = () => setFetchTick((t) => t + 1)

  const depsKey = JSON.stringify(config.deps ?? [])
  const knownDeps = useRef(depsKey)

  useEffect(() => {
    if (knownDeps.current === depsKey) return
    knownDeps.current = depsKey
    setSelectionState({})
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFetchTick((t) => t + 1)
  }, [depsKey])

  // ─── ungrouped mode: fetch a flat page of rows ─────────────────────────────
  useEffect(() => {
    if (groupBy) return
    let cancelled = false
    setLoading(true)
    setError(null)

    const params: FetchParams<Field, Filters> = { page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters }
    const pending = fetchPage(params)
    if (!pending) return
    generation.current += 1
    pending
      .then((result) => {
        if (cancelled) return
        setRows(result.rows)
        setTotal(result.total)
        setLoadedPage(params.page)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, config.data, fetchTick])

  // ─── grouped mode: fetch the group list ────────────────────────────────────
  useEffect(() => {
    if (!groupBy) return
    const params: FetchParams<Field, Filters> = {
      page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters, groupBy,
    }
    const pending = fetchGroupPage(params)
    if (!pending) return
    let cancelled = false
    setGroupsLoading(true)
    pending
      .then((result) => {
        if (cancelled) return
        setGroups(result.groups)
        setGroupsTotal(result.total)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setGroupsLoading(false)
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, config.data, fetchTick])

  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total

  const loadMore = () => {
    if (!fetchRecords || !hasMore || loading || loadingMore) return
    const page = loadedPage + 1
    const started = generation.current
    setLoadingMore(true)
    fetchRecords({ page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters })
      .then((result) => {
        if (generation.current !== started) return
        setRows((prev) => [...prev, ...result.rows])
        setTotal(result.total)
        setLoadedPage(page)
      })
      .catch((err) => {
        if (generation.current === started) setError(err)
      })
      .finally(() => setLoadingMore(false))
  }

  const fetchGroupRows = (key: string, page: number) => {
    if (!groupBy || !fetchRecords) return
    setGroupState((prev) => ({
      ...prev,
      [key]: { rows: prev[key]?.rows ?? [], total: prev[key]?.total ?? 0, pagination: { page, pageSize: pagination.pageSize }, loading: true },
    }))

    const params: FetchParams<Field, Filters> = {
      page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters, groupBy, groupKey: key,
    }
    fetchRecords(params)
      .then((result) => {
        setGroupState((prev) => ({
          ...prev,
          [key]: { rows: result.rows, total: result.total, pagination: { page, pageSize: pagination.pageSize }, loading: false },
        }))
      })
      .catch((err) => {
        setError(err)
        setGroupState((prev) => ({
          ...prev,
          [key]: { rows: prev[key]?.rows ?? [], total: prev[key]?.total ?? 0, pagination: { page, pageSize: pagination.pageSize }, loading: false },
        }))
      })
  }

  const toggleGroup = (key: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (next[key] && !groupState[key]) fetchGroupRows(key, 1)
      return next
    })
    if (expanded[key]) {
      const rows = groupState[key]?.rows ?? []
      if (rows.length) {
        setSelectionState((sel) => {
          const next = { ...sel }
          for (const row of rows) delete next[getRowId(row)]
          return next
        })
      }
    }
  }

  const setGroupPage = (key: string, page: number) => {
    fetchGroupRows(key, page)
  }

  const isGroupExpanded = (key: string) => Boolean(expanded[key])
  const groupRowsFor = (key: string) => groupState[key]?.rows ?? []
  const groupTotalFor = (key: string) => groupState[key]?.total ?? 0
  const groupLoadingFor = (key: string) => groupState[key]?.loading ?? false
  const groupPaginationFor = (key: string) => groupState[key]?.pagination ?? { page: 1, pageSize: pagination.pageSize }

  // ─── selection ──────────────────────────────────────────────────────────────
  const selectableRows: Row[] = groupBy
    ? groups.flatMap((g) => (expanded[g.key] ? groupState[g.key]?.rows ?? [] : []))
    : rows

  const selectedIds = Object.keys(selection).filter((id) => selection[id])
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((r) => selection[getRowId(r)])
  const someVisibleSelected = selectableRows.some((r) => selection[getRowId(r)])

  const isSelected = (id: string) => Boolean(selection[id])
  const toggleSelected = (id: string) => {
    setSelectionState((prev) => ({ ...prev, [id]: !prev[id] }))
  }
  const clearSelection = () => setSelectionState({})
  const toggleSelectAll = () => {
    setSelectionState((prev) => {
      const next = { ...prev }
      if (allVisibleSelected) {
        for (const row of selectableRows) delete next[getRowId(row)]
      } else {
        for (const row of selectableRows) next[getRowId(row)] = true
      }
      return next
    })
  }

  const groupAllSelected = (key: string) => {
    const rows = groupState[key]?.rows ?? []
    return rows.length > 0 && rows.every((r) => selection[getRowId(r)])
  }

  const groupSomeSelected = (key: string) => {
    const rows = groupState[key]?.rows ?? []
    return rows.some((r) => selection[getRowId(r)])
  }

  const toggleSelectGroup = (key: string) => {
    const rows = groupState[key]?.rows ?? []
    if (rows.length === 0) return
    const all = rows.every((r) => selection[getRowId(r)])
    setSelectionState((prev) => {
      const next = { ...prev }
      if (all) {
        for (const row of rows) delete next[getRowId(row)]
      } else {
        for (const row of rows) next[getRowId(row)] = true
      }
      return next
    })
  }

  const visibleItems: VisibleItem<Row, Field>[] = []
  if (groupBy) {
    for (const group of groups) {
      const open = Boolean(expanded[group.key])
      visibleItems.push({ type: 'group', group, expanded: open })
      if (open) {
        for (const row of groupState[group.key]?.rows ?? []) {
          visibleItems.push({ type: 'group-row', row, groupKey: group.key })
        }
      }
    }
  } else {
    for (const row of rows) visibleItems.push({ type: 'row', row })
  }

  return {
    columns,
    getRowId,
    groupByColumns,

    visibleColumns,
    hiddenColumns,
    setColumnHidden,

    search,
    setSearch: (value: string) => { setSearch(value); setPagination((p) => ({ ...p, page: 1 })) },

    filters,
    setFilters,

    sort,
    toggleSort,
    setSort,

    pagination,
    setPage,
    setPageSize,

    rows,
    total,
    loading,
    error,

    loadMore,
    hasMore,
    loadingMore,

    groupBy,
    setGroupBy,
    groups,
    groupsTotal,
    groupsLoading,

    isGroupExpanded,
    toggleGroup,
    groupRows: groupRowsFor,
    groupTotal: groupTotalFor,
    groupLoading: groupLoadingFor,
    groupPagination: groupPaginationFor,
    setGroupPage,

    visibleItems,

    selection,
    selectedIds,
    isSelected,
    toggleSelected,
    setSelection: setSelectionState,
    clearSelection,
    toggleSelectAll,
    allVisibleSelected,
    someVisibleSelected,
    groupAllSelected,
    groupSomeSelected,
    toggleSelectGroup,

    refetch,
  }
}
