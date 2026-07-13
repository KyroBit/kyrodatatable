import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClientEngine } from './clientEngine.js'
import type {
  ColumnDef, DataTableConfig, FetchParams, GroupByColumn, PaginationState,
  ResourceGroup, SortState, VisibleItem,
} from '../types/index.js'

interface GroupRuntime<Row> {
  rows: Row[]
  total: number
  pagination: PaginationState
  loading: boolean
}

export interface DataTableApi<Row, Field extends string = string, Filters = undefined> {
  // echoed straight back from config, so a renderer only ever needs `api` — never a second copy of these
  columns: ColumnDef<Row, Field>[]
  getRowId: (row: Row) => string
  groupByColumns?: GroupByColumn<Field>[]

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

export function useDataTable<Row, Field extends string = string, Filters = undefined>(
  config: DataTableConfig<Row, Field, Filters>,
): DataTableApi<Row, Field, Filters> {
  const { columns, getRowId, groupByColumns, initialPageSize, initialSort, initialFilters, searchDebounceMs } = config

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [fetchTick, setFetchTick] = useState(0)

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

  const clientEngine = useMemo(() => {
    if (!config.data) return null
    return createClientEngine<Row, Field, Filters>({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? (row: Row) => (row as Record<string, unknown>)[groupBy] : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.data, config.applyFilters, columns, groupBy])

  const fetchRecords = config.fetchRecords ?? clientEngine!.fetchRecords
  const fetchGroups = config.fetchGroups ?? (clientEngine ? clientEngine.fetchGroups : undefined)

  const setFilters = useCallback((next: Filters) => {
    setFiltersInternal(next)
    setPagination((p) => ({ ...p, page: 1 }))
  }, [])

  const setGroupBy = useCallback((field: Field | null) => {
    setGroupByField(field)
    setExpanded({})
    setGroupState({})
    setPagination((p) => ({ ...p, page: 1 }))
  }, [])

  const toggleSort = useCallback((field: Field) => {
    setSortInternal((current) => {
      if (!current || current.field !== field) return { field, direction: 'asc' }
      if (current.direction === 'asc') return { field, direction: 'desc' }
      return null
    })
    setPagination((p) => ({ ...p, page: 1 }))
  }, [])

  const setSort = useCallback((next: SortState<Field> | null) => {
    setSortInternal(next)
    setPagination((p) => ({ ...p, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setPagination((p) => ({ ...p, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize })
  }, [])

  const refetch = useCallback(() => setFetchTick((t) => t + 1), [])

  // ─── ungrouped mode: fetch a flat page of rows ─────────────────────────────
  useEffect(() => {
    if (groupBy) return
    let cancelled = false
    setLoading(true)
    setError(null)

    const params: FetchParams<Field, Filters> = { page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters }
    fetchRecords(params)
      .then((result) => {
        if (cancelled) return
        setRows(result.rows)
        setTotal(result.total)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, fetchRecords, fetchTick])

  // ─── grouped mode: fetch the group list ────────────────────────────────────
  useEffect(() => {
    if (!groupBy || !fetchGroups) return
    let cancelled = false
    setGroupsLoading(true)

    const params: FetchParams<Field, Filters> = {
      page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters as Filters, groupBy,
    }
    fetchGroups(params)
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
  }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, fetchGroups, fetchTick])

  const fetchGroupRows = useCallback((key: string, page: number) => {
    if (!groupBy) return
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
  }, [groupBy, pagination.pageSize, debouncedSearch, sort, filters, fetchRecords])

  const toggleGroup = useCallback((key: string) => {
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
  }, [groupState, fetchGroupRows, expanded, getRowId])

  const setGroupPage = useCallback((key: string, page: number) => {
    fetchGroupRows(key, page)
  }, [fetchGroupRows])

  const isGroupExpanded = useCallback((key: string) => Boolean(expanded[key]), [expanded])
  const groupRowsFor = useCallback((key: string) => groupState[key]?.rows ?? [], [groupState])
  const groupTotalFor = useCallback((key: string) => groupState[key]?.total ?? 0, [groupState])
  const groupLoadingFor = useCallback((key: string) => groupState[key]?.loading ?? false, [groupState])
  const groupPaginationFor = useCallback(
    (key: string) => groupState[key]?.pagination ?? { page: 1, pageSize: pagination.pageSize },
    [groupState, pagination.pageSize],
  )

  // ─── selection ──────────────────────────────────────────────────────────────
  const selectableRows = useMemo<Row[]>(() => {
    if (!groupBy) return rows
    return groups.flatMap((g) => (expanded[g.key] ? groupState[g.key]?.rows ?? [] : []))
  }, [groupBy, rows, groups, expanded, groupState])

  const selectedIds = useMemo(
    () => Object.keys(selection).filter((id) => selection[id]),
    [selection],
  )
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((r) => selection[getRowId(r)])
  const someVisibleSelected = selectableRows.some((r) => selection[getRowId(r)])

  const isSelected = useCallback((id: string) => Boolean(selection[id]), [selection])
  const toggleSelected = useCallback((id: string) => {
    setSelectionState((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])
  const clearSelection = useCallback(() => setSelectionState({}), [])
  const toggleSelectAll = useCallback(() => {
    setSelectionState((prev) => {
      const next = { ...prev }
      if (allVisibleSelected) {
        for (const row of selectableRows) delete next[getRowId(row)]
      } else {
        for (const row of selectableRows) next[getRowId(row)] = true
      }
      return next
    })
  }, [allVisibleSelected, selectableRows, getRowId])

  const groupAllSelected = useCallback((key: string) => {
    const rows = groupState[key]?.rows ?? []
    return rows.length > 0 && rows.every((r) => selection[getRowId(r)])
  }, [groupState, selection, getRowId])

  const groupSomeSelected = useCallback((key: string) => {
    const rows = groupState[key]?.rows ?? []
    return rows.some((r) => selection[getRowId(r)])
  }, [groupState, selection, getRowId])

  const toggleSelectGroup = useCallback((key: string) => {
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
  }, [groupState, selection, getRowId])

  const visibleItems = useMemo<VisibleItem<Row, Field>[]>(() => {
    if (!groupBy) return rows.map((row) => ({ type: 'row' as const, row }))
    const items: VisibleItem<Row, Field>[] = []
    for (const group of groups) {
      items.push({ type: 'group', group, expanded: isGroupExpanded(group.key) })
      if (isGroupExpanded(group.key)) {
        for (const row of groupRowsFor(group.key)) {
          items.push({ type: 'group-row', row, groupKey: group.key })
        }
      }
    }
    return items
  }, [groupBy, rows, groups, expanded, groupState, isGroupExpanded, groupRowsFor]) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => ({
    columns,
    getRowId,
    groupByColumns,

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    columns, getRowId, groupByColumns,
    search, filters, sort, pagination, rows, total, loading, error,
    groupBy, groups, groupsTotal, groupsLoading,
    setFilters, toggleSort, setSort, setPage, setPageSize, setGroupBy,
    isGroupExpanded, toggleGroup, groupRowsFor, groupTotalFor, groupLoadingFor, groupPaginationFor, setGroupPage,
    visibleItems, refetch,
    selection, selectedIds, isSelected, toggleSelected, clearSelection, toggleSelectAll,
    allVisibleSelected, someVisibleSelected,
    groupAllSelected, groupSomeSelected, toggleSelectGroup,
  ])
}
