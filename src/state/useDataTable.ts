import { startTransition, useEffect, useEffectEvent, useRef, useState, type RefObject } from 'react'
import { cachedList, entryKey, firstPage, load, rememberLastPage, type CachedList } from './cache.js'
import { createClientEngine } from './clientEngine.js'
import type {
  ColumnDef, DataTableConfig, FetchParams, FilterOption, FilterValues, GroupByColumn, PaginationState,
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
  cacheKey?: string

  /** `columns` minus the hidden ones, in the original order. What a renderer draws. */
  visibleColumns: ColumnDef<Row, Field>[]
  hiddenColumns: Field[]
  setColumnHidden: (field: Field, hidden: boolean) => void

  search: string
  setSearch: (value: string) => void

  filters: Filters | undefined
  setFilters: (filters: Filters) => void
  filterLabel: (field: string, value: string) => string | undefined
  rememberFilterLabels: (field: string, options: FilterOption[]) => void

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
  listKey: string

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

const rowIds = new WeakMap<object, number>()
let lastRowId = 0

const idOf = (row: unknown) => {
  if (typeof row !== 'object' || row === null) return 0
  const known = rowIds.get(row)
  if (known !== undefined) return known
  lastRowId += 1
  rowIds.set(row, lastRowId)
  return lastRowId
}

const rowsKey = (rows: readonly unknown[] | undefined) =>
  rows === undefined
    ? undefined
    : `${rows.length}:${rows.reduce<number>((hash, row) => (Math.imul(hash, 31) + idOf(row)) | 0, 7)}`

const enqueue = <Result,>(queue: RefObject<Promise<unknown>>, request: () => Promise<Result>) => {
  const next = queue.current.then(request)
  queue.current = next.catch(() => undefined)
  return next
}

export function useDataTable<Row, Field extends string = string, Filters = FilterValues>(
  config: DataTableConfig<Row, Field, Filters>,
): DataTableApi<Row, Field, Filters> {
  const { columns, getRowId, groupByColumns, searchDebounceMs, cacheKey } = config
  const [initial] = useState(() => {
    const params = firstPage(config)
    return { params, result: cacheKey === undefined ? undefined : cachedList<Row>(cacheKey, params) }
  })

  const [hiddenColumns, setHiddenColumns] = useState<Field[]>(config.initialHiddenColumns ?? [])

  const setColumnHidden = (field: Field, hidden: boolean) => {
    setHiddenColumns((current) =>
      hidden ? (current.includes(field) ? current : [...current, field]) : current.filter((f) => f !== field),
    )
  }

  const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column.field))

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFiltersInternal] = useState<Filters | undefined>(initial.params.filters)
  const [filterLabels, setFilterLabels] = useState<Record<string, Record<string, string>>>({})
  const [sort, setSortInternal] = useState<SortState<Field> | null>(initial.params.sort)
  const [pagination, setPagination] = useState<PaginationState>({
    page: initial.params.page,
    pageSize: initial.params.pageSize,
  })

  const [rows, setRows] = useState<Row[]>(initial.result?.rows ?? [])
  const [total, setTotal] = useState(initial.result?.total ?? 0)
  // The first fetch starts on mount, so the first render must already read as loading, or a
  // table flashes its empty state before the first page arrives.
  const [loading, setLoading] = useState(!initial.result)
  const [error, setError] = useState<unknown>(null)
  const [fetchTick, setFetchTick] = useState(0)
  const [loadedPage, setLoadedPage] = useState(initial.result?.lastPage ?? 1)
  const [loadingMore, setLoadingMore] = useState(false)
  const generation = useRef(0)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const requestedMore = useRef<string | null>(null)

  const [groupBy, setGroupByField] = useState<Field | null>(null)
  const [groups, setGroups] = useState<ResourceGroup<Field>[]>([])
  const [groupsTotal, setGroupsTotal] = useState(0)
  const [groupsLoading, setGroupsLoading] = useState(false)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [groupState, setGroupState] = useState<Record<string, GroupRuntime<Row>>>({})
  const [selection, setSelectionState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!searchDebounceMs) { setDebouncedSearch(search); return }
    const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs)
    return () => clearTimeout(id)
  }, [search, searchDebounceMs])

  const dataKey = rowsKey(config.data)

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

  const setFilters = (next: Filters) =>
    startTransition(() => {
      setFiltersInternal(next)
      setPagination((p) => ({ ...p, page: 1 }))
    })

  const filterLabel = (field: string, value: string) => filterLabels[field]?.[value]

  const rememberFilterLabels = (field: string, options: FilterOption[]) =>
    setFilterLabels((known) => {
      const fresh = options.filter((option) => known[field]?.[option.value] !== option.label)
      if (fresh.length === 0) return known
      const labels = { ...known[field] }
      for (const option of fresh) labels[option.value] = option.label
      return { ...known, [field]: labels }
    })

  const setGroupBy = (field: Field | null) =>
    startTransition(() => {
      setGroupByField(field)
      setExpanded({})
      setGroupState({})
      setPagination((p) => ({ ...p, page: 1 }))
    })

  const toggleSort = (field: Field) =>
    startTransition(() => {
      setSortInternal((current) => {
        if (!current || current.field !== field) return { field, direction: 'asc' }
        if (current.direction === 'asc') return { field, direction: 'desc' }
        return null
      })
      setPagination((p) => ({ ...p, page: 1 }))
    })

  const setSort = (next: SortState<Field> | null) =>
    startTransition(() => {
      setSortInternal(next)
      setPagination((p) => ({ ...p, page: 1 }))
    })

  const setPage = (page: number) => startTransition(() => setPagination((p) => ({ ...p, page })))

  const setPageSize = (pageSize: number) => startTransition(() => setPagination({ page: 1, pageSize }))

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

  const listParams: FetchParams<Field, Filters> = {
    page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters,
  }
  const listKey = entryKey(cacheKey ?? '', listParams)

  useEffect(() => {
    if (groupBy) return
    let cancelled = false
    const restored = cacheKey === undefined ? undefined : cachedList<Row>(cacheKey, listParams)
    const setList = (list: CachedList<Row>) => {
      setRows(list.rows)
      setTotal(list.total)
      setLoadedPage(list.lastPage)
    }
    const show = (list: CachedList<Row>) => startTransition(() => setList(list))
    if (restored) setList(restored)
    setLoading(!restored)
    setLoadingMore(false)
    setError(null)
    requestedMore.current = null

    const pending = cacheKey === undefined ? fetchPage(listParams) : load(entryKey(cacheKey, listParams), () => fetchPage(listParams)!)
    if (!pending) return
    generation.current += 1
    queue.current = pending.catch(() => undefined)

    const refreshFrom = (page: number): Promise<void> | undefined => {
      if (cancelled || cacheKey === undefined || page > (restored?.lastPage ?? 0)) return
      const pageParams = { ...listParams, page }
      return enqueue(queue, () => load(entryKey(cacheKey, pageParams), () => fetchPage(pageParams)!)).then(() => {
        if (cancelled) return
        show(cachedList<Row>(cacheKey, listParams)!)
        return refreshFrom(page + 1)
      })
    }

    pending
      .then((first) => {
        if (cancelled) return
        show(cacheKey === undefined ? { ...first, lastPage: listParams.page } : cachedList<Row>(cacheKey, listParams)!)
        startTransition(() => setLoading(false))
        return refreshFrom(listParams.page + 1)
      })
      .catch((err) => {
        if (cancelled) return
        startTransition(() => {
          setError(err)
          setLoading(false)
        })
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey])

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
        startTransition(() => {
          setGroups(result.groups)
          setGroupsTotal(result.total)
        })
      })
      .catch((err) => {
        if (!cancelled) startTransition(() => setError(err))
      })
      .finally(() => {
        if (!cancelled) startTransition(() => setGroupsLoading(false))
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick])

  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total

  const loadMore = () => {
    const page = loadedPage + 1
    const params = { ...listParams, page }
    const key = entryKey(cacheKey ?? '', params)
    if (!fetchRecords || !hasMore || loading || requestedMore.current === key) return
    requestedMore.current = key
    const started = generation.current
    setLoadingMore(true)
    enqueue(queue, () => (cacheKey === undefined ? fetchRecords(params) : load(key, () => fetchRecords(params))))
      .then((result) => {
        if (generation.current !== started) return
        if (cacheKey !== undefined) rememberLastPage(listKey, page)
        startTransition(() => {
          setRows((prev) => [...prev, ...result.rows])
          setTotal(result.total)
          setLoadedPage(page)
          setLoadingMore(false)
        })
      })
      .catch((err) => {
        requestedMore.current = null
        if (generation.current !== started) return
        startTransition(() => {
          setError(err)
          setLoadingMore(false)
        })
      })
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
        startTransition(() =>
          setGroupState((prev) => ({
            ...prev,
            [key]: { rows: result.rows, total: result.total, pagination: { page, pageSize: pagination.pageSize }, loading: false },
          })),
        )
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
    cacheKey,

    visibleColumns,
    hiddenColumns,
    setColumnHidden,

    search,
    setSearch: (value: string) => { setSearch(value); setPagination((p) => ({ ...p, page: 1 })) },

    filters,
    setFilters,
    filterLabel,
    rememberFilterLabels,

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
    listKey,

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
