import { startTransition, useEffect, useEffectEvent, useRef, useState, type RefObject } from 'react'
import { cachedList, entryKey, firstPage, load, rememberLastPage, type CachedList } from './cache.js'
import { createClientEngine } from './clientEngine.js'
import { isPathSelected, isRowSelected } from './selection.js'
import type {
  ColumnDef, DataTableConfig, FetchParams, FilterOption, FilterValues, GroupByColumn, GroupPathEntry, PaginationState,
  ResourceGroup, Selection, SortState, VisibleItem,
} from '../types/index.js'

interface GroupRuntime<Row, Field extends string> {
  rows: Row[]
  groups: ResourceGroup<Field>[]
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

  groupBy: Field[]
  setGroupBy: (fields: Field[]) => void
  groups: ResourceGroup<Field>[]
  groupsTotal: number
  groupsLoading: boolean
  groupPageSize: number
  setGroupPageSize: (size: number) => void

  isGroupExpanded: (id: string) => boolean
  toggleGroup: (id: string) => void
  groupRows: (id: string) => Row[]
  groupTotal: (id: string) => number
  groupLoading: (id: string) => boolean
  groupPagination: (id: string) => PaginationState
  setGroupPage: (id: string, page: number) => void

  /** Flat + grouped rows in one display-ordered list — see the `VisibleItem` type. What every built-in renderer actually iterates. */
  visibleItems: VisibleItem<Row, Field>[]

  selection: Selection<Field>
  selectedCount: number
  isSelected: (id: string) => boolean
  toggleSelected: (id: string) => void
  setSelection: (selection: Selection<Field>) => void
  clearSelection: () => void
  toggleSelectAll: () => void
  allSelected: boolean
  someSelected: boolean
  groupAllSelected: (id: string) => boolean
  groupSomeSelected: (id: string) => boolean
  toggleSelectGroup: (id: string) => void

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

interface Picked {
  all: boolean
  groups: Record<string, boolean>
  rows: Record<string, { selected: boolean; group: string | null }>
}

const nothingPicked: Picked = { all: false, groups: {}, rows: {} }

const groupIdOf = (path: GroupPathEntry<string>[]) => JSON.stringify(path.map((entry) => [entry.field, entry.key]))
const contains = (id: string, other: string) => other === id || other.startsWith(`${id.slice(0, -1)},`)

const enqueue = <Result,>(queue: RefObject<Promise<unknown>>, request: () => Promise<Result>) => {
  const next = queue.current.then(request)
  queue.current = next.catch(() => undefined)
  return next
}

export function useDataTable<Row, Field extends string = string, Filters = FilterValues>(
  config: DataTableConfig<Row, Field, Filters>,
): DataTableApi<Row, Field, Filters> {
  const { columns, getRowId, groupByColumns, searchDebounceMs, cacheKey } = config
  const startingGroup = (config.initialGroupBy ?? []).filter((field) => groupByColumns?.some((column) => column.field === field))
  const [initial] = useState(() => {
    const params = firstPage(config)
    const flat = startingGroup.length === 0 && cacheKey !== undefined
    return { params, groupBy: startingGroup, result: flat ? cachedList<Row>(cacheKey, params) : undefined }
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
  const [loading, setLoading] = useState(!initial.result && initial.groupBy.length === 0)
  const [error, setError] = useState<unknown>(null)
  const [fetchTick, setFetchTick] = useState(0)
  const [loadedPage, setLoadedPage] = useState(initial.result?.lastPage ?? 1)
  const [loadingMore, setLoadingMore] = useState(false)
  const generation = useRef(0)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const requestedMore = useRef<string | null>(null)

  const [groupBy, setGroupByField] = useState<Field[]>(initial.groupBy)
  const grouped = groupBy.length > 0
  const [groups, setGroups] = useState<ResourceGroup<Field>[]>([])
  const [groupsTotal, setGroupsTotal] = useState(0)
  const [groupsLoading, setGroupsLoading] = useState(initial.groupBy.length > 0)
  const [groupsPage, setGroupsPage] = useState(1)
  const [groupPageSize, setGroupPageSizeState] = useState(config.initialGroupPageSize ?? initial.params.pageSize)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [groupState, setGroupState] = useState<Record<string, GroupRuntime<Row, Field>>>({})
  const [picked, setPicked] = useState<Picked>(nothingPicked)

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
      setPicked(nothingPicked)
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

  const setGroupBy = (fields: Field[]) =>
    startTransition(() => {
      setGroupByField(fields)
      setPicked(nothingPicked)
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

  const setGroupPageSize = (size: number) =>
    startTransition(() => {
      setGroupPageSizeState(size)
      setExpanded({})
      setGroupState({})
      setPagination((p) => ({ ...p, page: 1 }))
    })

  const refetch = () => setFetchTick((t) => t + 1)

  const depsKey = JSON.stringify(config.deps ?? [])
  const knownDeps = useRef(depsKey)

  useEffect(() => {
    if (knownDeps.current === depsKey) return
    knownDeps.current = depsKey
    if (startingGroup.length > 0) {
      setGroupByField(startingGroup)
      setExpanded({})
      setGroupState({})
    }
    setPicked(nothingPicked)
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFetchTick((t) => t + 1)
  }, [depsKey])

  const listParams: FetchParams<Field, Filters> = {
    page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters,
  }
  const listKey = entryKey(cacheKey ?? '', listParams)

  useEffect(() => {
    if (grouped) return
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
  }, [grouped, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey])

  useEffect(() => {
    if (groupBy.length === 0) return
    const params: FetchParams<Field, Filters> = {
      page: pagination.page, pageSize: groupPageSize, search: debouncedSearch, sort, filters: filters as Filters,
      groupBy: groupBy[0], groupPath: [],
    }
    const pending = fetchGroupPage(params)
    generation.current += 1
    setLoadingMore(false)
    if (!pending) return
    let cancelled = false
    setGroupsLoading(true)
    pending
      .then((result) => {
        if (cancelled) return
        startTransition(() => {
          setGroups(result.groups)
          setGroupsTotal(result.total)
          setTotal(result.records)
          setGroupsPage(params.page)
        })
      })
      .catch((err) => {
        if (!cancelled) startTransition(() => setError(err))
      })
      .finally(() => {
        if (!cancelled) startTransition(() => setGroupsLoading(false))
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, groupPageSize, debouncedSearch, sort, filters, dataKey, fetchTick])

  const hasMore = grouped
    ? (pagination.page - 1) * groupPageSize + groups.length < groupsTotal
    : (pagination.page - 1) * pagination.pageSize + rows.length < total

  const loadMoreGroups = () => {
    if (!hasMore || groupsLoading || loadingMore) return
    const page = groupsPage + 1
    const pending = fetchGroups?.({ ...listParams, page, pageSize: groupPageSize, groupBy: groupBy[0], groupPath: [] })
    if (!pending) return
    const started = generation.current
    setLoadingMore(true)
    pending
      .then((result) => {
        if (generation.current !== started) return
        startTransition(() => {
          setGroups((prev) => [...prev, ...result.groups])
          setGroupsTotal(result.total)
          setTotal(result.records)
          setGroupsPage(page)
          setLoadingMore(false)
        })
      })
      .catch((err) => {
        if (generation.current !== started) return
        startTransition(() => {
          setError(err)
          setLoadingMore(false)
        })
      })
  }

  const loadFlatPage = () => {
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

  const loadMore = grouped ? loadMoreGroups : loadFlatPage

  const visibleItems: VisibleItem<Row, Field>[] = []
  const nodes = new Map<string, { path: GroupPathEntry<Field>[]; leaf: boolean }>()
  const rowGroups = new Map<string, string>()
  const walk = (list: ResourceGroup<Field>[], parent: GroupPathEntry<Field>[]) => {
    for (const group of list) {
      const depth = parent.length
      const path = [...parent, { field: groupBy[depth]!, key: group.key }]
      const id = groupIdOf(path)
      const leaf = depth === groupBy.length - 1
      const open = Boolean(expanded[id])
      nodes.set(id, { path, leaf })
      visibleItems.push({ type: 'group', id, group, depth, expanded: open })
      if (!open) continue
      if (!leaf) {
        walk(groupState[id]?.groups ?? [], path)
        continue
      }
      for (const row of groupState[id]?.rows ?? []) {
        rowGroups.set(getRowId(row), id)
        visibleItems.push({ type: 'group-row', row, groupId: id, depth: depth + 1 })
      }
    }
  }
  if (grouped) walk(groups, [])
  else for (const row of rows) visibleItems.push({ type: 'row', row })

  const updateGroup = (id: string, patch: Partial<GroupRuntime<Row, Field>>) =>
    setGroupState((prev) => ({
      ...prev,
      [id]: { rows: [], groups: [], total: 0, pagination: { page: 1, pageSize: pagination.pageSize }, loading: false, ...prev[id], ...patch },
    }))

  const fetchChildren = (id: string, page: number) => {
    const node = nodes.get(id)
    if (!node) return
    const pageSize = node.leaf ? pagination.pageSize : groupPageSize
    const params: FetchParams<Field, Filters> = {
      page, pageSize, search: debouncedSearch, sort, filters: filters as Filters, groupPath: node.path,
    }
    const pending: Promise<Partial<GroupRuntime<Row, Field>>> | undefined = node.leaf
      ? fetchRecords?.(params).then((result) => ({ rows: result.rows, total: result.total }))
      : fetchGroups?.({ ...params, groupBy: groupBy[node.path.length] }).then((result) => ({ groups: result.groups, total: result.total }))
    if (!pending) return
    updateGroup(id, { pagination: { page, pageSize }, loading: true })
    pending
      .then((patch) => startTransition(() => updateGroup(id, { ...patch, loading: false })))
      .catch((err) => {
        setError(err)
        updateGroup(id, { loading: false })
      })
  }

  const toggleGroup = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    if (!expanded[id] && !groupState[id]) fetchChildren(id, 1)
  }

  const isGroupExpanded = (id: string) => Boolean(expanded[id])
  const groupRowsFor = (id: string) => groupState[id]?.rows ?? []
  const groupTotalFor = (id: string) => groupState[id]?.total ?? 0
  const groupLoadingFor = (id: string) => groupState[id]?.loading ?? false
  const groupPaginationFor = (id: string) => groupState[id]?.pagination ?? { page: 1, pageSize: pagination.pageSize }

  const pathOf = (id: string) => (JSON.parse(id) as [Field, string][]).map(([field, key]) => ({ field, key }))

  const selection: Selection<Field> = {
    all: picked.all,
    groups: Object.entries(picked.groups).map(([id, selected]) => ({ path: pathOf(id), selected })),
    rows: Object.entries(picked.rows).map(([id, row]) => ({ id, selected: row.selected })),
  }

  const rowPath = (id: string) => {
    const group = rowGroups.get(id)
    return group === undefined ? [] : pathOf(group)
  }

  const decidedBeneath = (id: string, selected: boolean) =>
    Object.entries(picked.groups).some(([key, value]) => key !== id && contains(id, key) && value === selected) ||
    Object.values(picked.rows).some((row) => row.group !== null && contains(id, row.group) && row.selected === selected)

  const groupAllSelected = (id: string) => isPathSelected(selection, pathOf(id)) && !decidedBeneath(id, false)
  const groupSomeSelected = (id: string) => isPathSelected(selection, pathOf(id)) || decidedBeneath(id, true)

  const exceptions = Object.values(picked.rows).filter((row) => row.selected !== picked.all).length
  const countIn = (list: ResourceGroup<Field>[], parent: GroupPathEntry<Field>[], records: number): number => {
    const unloaded = records - list.reduce((sum, group) => sum + group.count, 0)
    return list.reduce((sum, group) => {
      const path = [...parent, { field: groupBy[parent.length]!, key: group.key }]
      const id = groupIdOf(path)
      const on = isPathSelected(selection, path)
      const children = groupState[id]?.groups
      if (!decidedBeneath(id, !on)) return sum + (on ? group.count : 0)
      if (path.length < groupBy.length && children) return sum + countIn(children, path, group.count)
      const flipped = Object.values(picked.rows).filter((row) => row.group === id && row.selected !== on).length
      return sum + (on ? group.count - flipped : flipped)
    }, isPathSelected(selection, parent) ? unloaded : 0)
  }
  const selectedCount = grouped ? countIn(groups, [], total) : picked.all ? total - exceptions : exceptions

  const allSelected = picked.all && !Object.values(picked.groups).includes(false) && !Object.values(picked.rows).some((row) => !row.selected)
  const someSelected = picked.all || Object.values(picked.groups).includes(true) || Object.values(picked.rows).some((row) => row.selected)

  const isSelected = (id: string) => isRowSelected(selection, id, rowPath(id))

  const toggleSelected = (id: string) => {
    const group = rowGroups.get(id) ?? null
    const next = !isSelected(id)
    const inherited = isPathSelected(selection, rowPath(id))
    setPicked((prev) => {
      const rows = { ...prev.rows }
      if (next === inherited) delete rows[id]
      else rows[id] = { selected: next, group }
      return { ...prev, rows }
    })
  }

  const toggleSelectGroup = (id: string) => {
    const path = pathOf(id)
    const next = !groupAllSelected(id)
    const inherited = isPathSelected(selection, path.slice(0, -1))
    setPicked((prev) => {
      const groups = Object.fromEntries(Object.entries(prev.groups).filter(([key]) => !contains(id, key)))
      const rows = Object.fromEntries(Object.entries(prev.rows).filter(([, row]) => row.group === null || !contains(id, row.group)))
      if (next !== inherited) groups[id] = next
      return { ...prev, groups, rows }
    })
  }

  const setSelection = (next: Selection<Field>) =>
    setPicked({
      all: next.all,
      groups: Object.fromEntries(next.groups.map((group) => [groupIdOf(group.path), group.selected])),
      rows: Object.fromEntries(next.rows.map((row) => [row.id, { selected: row.selected, group: null }])),
    })

  return {
    columns,
    getRowId,
    groupByColumns,
    cacheKey,

    visibleColumns,
    hiddenColumns,
    setColumnHidden,

    search,
    setSearch: (value: string) => {
      setSearch(value)
      setPicked(nothingPicked)
      setPagination((p) => ({ ...p, page: 1 }))
    },

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
    groupPageSize,
    setGroupPageSize,

    isGroupExpanded,
    toggleGroup,
    groupRows: groupRowsFor,
    groupTotal: groupTotalFor,
    groupLoading: groupLoadingFor,
    groupPagination: groupPaginationFor,
    setGroupPage: fetchChildren,

    visibleItems,

    selection,
    selectedCount,
    isSelected,
    toggleSelected,
    setSelection,
    clearSelection: () => setPicked(nothingPicked),
    toggleSelectAll: () => setPicked({ all: !allSelected, groups: {}, rows: {} }),
    allSelected,
    someSelected,
    groupAllSelected,
    groupSomeSelected,
    toggleSelectGroup,

    refetch,
  }
}
