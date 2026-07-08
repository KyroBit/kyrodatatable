import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  DataTableConfig,
  FetchParams,
  PaginationState,
  ResourceGroup,
  SortState,
} from '../types/index.js'

interface GroupRuntime<Row> {
  rows: Row[]
  total: number
  pagination: PaginationState
  loading: boolean
}

export interface DataTableApi<Row, Field extends string = string> {
  search: string
  setSearch: (value: string) => void

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

  groupByColumns: DataTableConfig<Row, Field>['groupByColumns']
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

  refetch: () => void
}

const DEFAULT_PAGE_SIZE = 25

export function useDataTable<Row, Field extends string = string>(
  config: DataTableConfig<Row, Field>,
): DataTableApi<Row, Field> {
  const { fetchRecords, fetchGroups, groupByColumns, initialPageSize, initialSort } = config

  const [search, setSearch] = useState('')
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

    const params: FetchParams<Field> = { page: pagination.page, pageSize: pagination.pageSize, search, sort }
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
  }, [groupBy, pagination.page, pagination.pageSize, search, sort, fetchRecords, fetchTick])

  // ─── grouped mode: fetch the group list ────────────────────────────────────
  useEffect(() => {
    if (!groupBy || !fetchGroups) return
    let cancelled = false
    setGroupsLoading(true)

    const params: FetchParams<Field> = {
      page: pagination.page, pageSize: pagination.pageSize, search, sort, groupBy,
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
  }, [groupBy, pagination.page, pagination.pageSize, search, sort, fetchGroups, fetchTick])

  const fetchGroupRows = useCallback((key: string, page: number) => {
    if (!groupBy) return
    setGroupState((prev) => ({
      ...prev,
      [key]: { rows: prev[key]?.rows ?? [], total: prev[key]?.total ?? 0, pagination: { page, pageSize: pagination.pageSize }, loading: true },
    }))

    const params: FetchParams<Field> = {
      page, pageSize: pagination.pageSize, search, sort, groupBy, groupKey: key,
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
  }, [groupBy, pagination.pageSize, search, sort, fetchRecords])

  const toggleGroup = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (next[key] && !groupState[key]) fetchGroupRows(key, 1)
      return next
    })
  }, [groupState, fetchGroupRows])

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

  return useMemo(() => ({
    search,
    setSearch: (value: string) => { setSearch(value); setPagination((p) => ({ ...p, page: 1 })) },

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

    groupByColumns,
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

    refetch,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    search, sort, pagination, rows, total, loading, error,
    groupByColumns, groupBy, groups, groupsTotal, groupsLoading,
    toggleSort, setSort, setPage, setPageSize, setGroupBy,
    isGroupExpanded, toggleGroup, groupRowsFor, groupTotalFor, groupLoadingFor, groupPaginationFor, setGroupPage,
    refetch,
  ])
}
