export type SortDirection = 'asc' | 'desc'

export interface SortState<Field extends string = string> {
  field: Field
  direction: SortDirection
}

export interface PaginationState {
  page: number
  pageSize: number
}

export interface ColumnDef<Row, Field extends string = string> {
  field: Field
  headerName: string
  sortable?: boolean
  /** Included in client-mode search matching. Default `true`. */
  searchable?: boolean
  align?: 'left' | 'right' | 'center'
  render?: (row: Row) => unknown
}

export interface GroupByColumn<Field extends string = string> {
  field: Field
  label: string
}

export interface ResourceGroup<Field extends string = string> {
  key: string
  field: Field
  label: string
  count: number
}

export interface FetchParams<Field extends string = string, Filters = undefined> {
  page: number
  pageSize: number
  search: string
  sort: SortState<Field> | null
  filters: Filters
  groupBy?: Field
  groupKey?: string
}

export interface FetchResult<Row> {
  rows: Row[]
  total: number
}

export interface FetchGroupsResult<Field extends string = string> {
  total: number
  groups: ResourceGroup<Field>[]
}

/** One item in display order — a plain row, a group header, or a row inside an expanded group. Lets any renderer draw a grouped table with one `.map()`, without hand-nesting a rows-loop inside a groups-loop. */
export type VisibleItem<Row, Field extends string = string> =
  | { type: 'row'; row: Row }
  | { type: 'group'; group: ResourceGroup<Field>; expanded: boolean }
  | { type: 'group-row'; row: Row; groupKey: string }

interface DataTableConfigBase<Row, Field extends string, Filters> {
  columns: ColumnDef<Row, Field>[]
  getRowId: (row: Row) => string
  groupByColumns?: GroupByColumn<Field>[]
  initialPageSize?: number
  initialSort?: SortState<Field> | null
  initialFilters?: Filters
  /** Delay, in ms, between a `setSearch` call and the query it triggers actually running. Default `0` (no debounce). */
  searchDebounceMs?: number
}

export interface ServerDataTableConfig<Row, Field extends string = string, Filters = undefined>
  extends DataTableConfigBase<Row, Field, Filters> {
  /** Called for the flat list, and again per-group (with `groupBy`/`groupKey` set) when a group is expanded. */
  fetchRecords: (params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>
  /** Enables grouping. Without it, `groupByColumns` has nothing to call. */
  fetchGroups?: (params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>
  data?: undefined
}

export interface ClientDataTableConfig<Row, Field extends string = string, Filters = undefined>
  extends DataTableConfigBase<Row, Field, Filters> {
  /** The whole dataset, already loaded. Search, sort, pagination, and grouping all run in memory — no fetch functions needed. */
  data: Row[]
  /** Only needed if you also use `filters` in client mode — filtering has no generic default, since a filter's shape is yours. */
  applyFilters?: (row: Row, filters: Filters) => boolean
  fetchRecords?: undefined
  fetchGroups?: undefined
}

export type DataTableConfig<Row, Field extends string = string, Filters = undefined> =
  | ServerDataTableConfig<Row, Field, Filters>
  | ClientDataTableConfig<Row, Field, Filters>
