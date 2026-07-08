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

export interface FetchParams<Field extends string = string> {
  page: number
  pageSize: number
  search: string
  sort: SortState<Field> | null
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

export interface DataTableConfig<Row, Field extends string = string> {
  columns: ColumnDef<Row, Field>[]
  groupByColumns?: GroupByColumn<Field>[]
  fetchRecords: (params: FetchParams<Field>) => Promise<FetchResult<Row>>
  fetchGroups?: (params: FetchParams<Field>) => Promise<FetchGroupsResult<Field>>
  initialPageSize?: number
  initialSort?: SortState<Field> | null
  getRowId: (row: Row) => string
}
