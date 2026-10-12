import type { ReactNode } from 'react'
export type SortDirection = 'asc' | 'desc'

export interface DateRangeValue {
  from?: string
  to?: string
}

/**
 * Filters shape used by the built-in filter UI: field → its current value.
 * A `select` field holds the selected option values; `text` holds the typed
 * string; `date` holds a single-sided or two-sided range.
 */
export type FilterValues = Record<string, string[] | string | DateRangeValue>

export interface FilterOption {
  label: string
  value: string
}

/** Sync options render immediately; an async source is called on every search-box change (debounced by the popover). */
export type FilterOptionsSource = FilterOption[] | ((query: string) => Promise<FilterOption[]>)

export interface SelectFilterColumnDef {
  type: 'select'
  field: string
  label: string
  options: FilterOptionsSource
  multi?: boolean
}

export interface TextFilterColumnDef {
  type: 'text'
  field: string
  label: string
  placeholder?: string
  inputType?: 'text' | 'number'
}

export interface DateFilterColumnDef {
  type: 'date'
  field: string
  label: string
  /** Renders paired From/To inputs instead of a single date. */
  range?: boolean
}

/** Toggle chips, for a handful of fixed values you switch between at a glance. */
export interface ChoiceFilterColumnDef {
  type: 'choice'
  field: string
  label: string
  options: FilterOption[]
  multi?: boolean
}

/** What every filter field renderer receives, built-in or your own. */
export interface FilterFieldProps<Column = FilterColumnDef> {
  column: Column
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}

/**
 * Swap the component used for a filter type. Anything you leave out keeps the
 * bundled MUI renderer, so the library still works with no configuration.
 */
export type FilterRenderers = Partial<Record<FilterColumnDef['type'], (props: FilterFieldProps<never>) => ReactNode>>

/** One section in the built-in filter popover. */
export type FilterColumnDef =
  | SelectFilterColumnDef
  | ChoiceFilterColumnDef
  | TextFilterColumnDef
  | DateFilterColumnDef

/** A bulk action offered on the current selection. */
export interface ResourceAction {
  label: string
  /** Shown as the dialog's title, so write it as a question. */
  confirmationMessage?: (count: number) => string
  /** Optional body line under the title — the consequence of confirming. */
  confirmationDescription?: (count: number) => string
  /** Colour of the confirm button. Defaults to `error`. */
  confirmColor?: 'primary' | 'error' | 'warning' | 'success'
  handle: (rowIds: string[]) => void | Promise<void>
}

export interface ExportFormat {
  id: string
  label: string
}

/** Everything a backend needs to reproduce the current result set for an export. */
export interface ExportRequest<Field extends string = string, Filters = FilterValues> {
  format: string
  search: string
  sort: SortState<Field> | null
  filters: Filters | undefined
  groupBy: Field | null
  selectedIds: string[]
}

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
  /**
   * This column's share of the table's width, e.g. `'40%'` or `'220px'`. Setting it on
   * any column switches the table to a fixed layout for that render; columns left
   * without a `width` split the remaining space evenly. Omit entirely (the default)
   * to keep the browser's content-driven auto layout.
   */
  width?: string
  /** Only needed for exceptional cells (badges, action buttons, custom markup). Plain values render as-is with the table's cell typography. */
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

export interface FetchParams<Field extends string = string, Filters = FilterValues> {
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
  /** Columns hidden until the reader turns them on. Anything not listed starts visible. */
  initialHiddenColumns?: Field[]
  /** External values the data depends on — an active organisation, a selected branch. When any
   * of them changes the table drops back to page 1, clears its selection and refetches, the way
   * a query key does. Compared by value, so inline arrays are fine. */
  deps?: readonly unknown[]
}

export interface ServerDataTableConfig<Row, Field extends string = string, Filters = FilterValues>
  extends DataTableConfigBase<Row, Field, Filters> {
  /** Called for the flat list, and again per-group (with `groupBy`/`groupKey` set) when a group is expanded. */
  fetchRecords: (params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>
  /** Enables grouping. Without it, `groupByColumns` has nothing to call. */
  fetchGroups?: (params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>
  data?: undefined
  applyFilters?: undefined
}

export interface ClientDataTableConfig<Row, Field extends string = string, Filters = FilterValues>
  extends DataTableConfigBase<Row, Field, Filters> {
  /** The whole dataset. Search, sort, pagination, and grouping all run in memory — no fetch functions needed.
   * `undefined` while the dataset is still loading, so the table shows its loading state rather than an empty one. */
  data: Row[] | undefined
  /** Only needed if you also use `filters` in client mode — filtering has no generic default, since a filter's shape is yours. */
  applyFilters?: (row: Row, filters: Filters) => boolean
  fetchRecords?: undefined
  fetchGroups?: undefined
}

export type DataTableConfig<Row, Field extends string = string, Filters = FilterValues> =
  | ServerDataTableConfig<Row, Field, Filters>
  | ClientDataTableConfig<Row, Field, Filters>
