import type {
  ColumnDef, FetchGroupsResult, FetchParams, FetchResult, ResourceGroup,
} from '../types/index.js'

function searchableFields<Row, Field extends string>(
  columns: ColumnDef<Row, Field>[],
): Field[] {
  return columns.filter((c) => c.searchable !== false).map((c) => c.field)
}

function matchesSearch<Row, Field extends string>(
  row: Row, search: string, fields: Field[],
): boolean {
  if (!search) return true
  const needle = search.toLowerCase()
  return fields.some((field) => {
    const value = (row as Record<string, unknown>)[field]
    return typeof value === 'string' && value.toLowerCase().includes(needle)
  })
}

function sortRows<Row, Field extends string>(
  rows: Row[], sort: FetchParams<Field>['sort'],
): Row[] {
  if (!sort) return rows
  const { field, direction } = sort
  const dir = direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[field]
    const bv = (b as Record<string, unknown>)[field]
    if (av === bv) return 0
    return (av as never) > (bv as never) ? dir : -dir
  })
}

function paginate<Row>(rows: Row[], page: number, pageSize: number): { rows: Row[]; total: number } {
  const total = rows.length
  const start = (page - 1) * pageSize
  return { rows: rows.slice(start, start + pageSize), total }
}

const valueOf = (row: unknown, field: string) => String((row as Record<string, unknown>)[field])

export interface ClientEngineOptions<Row, Field extends string, Filters> {
  data: Row[]
  columns: ColumnDef<Row, Field>[]
  applyFilters?: (row: Row, filters: Filters) => boolean
}

export function createClientEngine<Row, Field extends string, Filters>({
  data, columns, applyFilters,
}: ClientEngineOptions<Row, Field, Filters>) {
  const fields = searchableFields(columns)

  function filtered(params: FetchParams<Field, Filters>): Row[] {
    const path = params.groupPath ?? []
    return data.filter((row) =>
      path.every((entry) => valueOf(row, entry.field) === entry.key) &&
      matchesSearch(row, params.search, fields) &&
      (!applyFilters || params.filters === undefined || applyFilters(row, params.filters)),
    )
  }

  async function fetchRecords(params: FetchParams<Field, Filters>): Promise<FetchResult<Row>> {
    return paginate(sortRows(filtered(params), params.sort), params.page, params.pageSize)
  }

  async function fetchGroups(params: FetchParams<Field, Filters>): Promise<FetchGroupsResult<Field>> {
    const field = params.groupBy
    if (!field) return { total: 0, records: 0, groups: [] }
    const rows = filtered(params)
    const buckets = new Map<string, number>()
    for (const row of rows) {
      const key = valueOf(row, field)
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
    const groups: ResourceGroup<Field>[] = [...buckets.entries()].map(([key, count]) => ({ key, field, label: key, count }))
    return { total: groups.length, records: rows.length, groups: groups.slice((params.page - 1) * params.pageSize, params.page * params.pageSize) }
  }

  return { fetchRecords, fetchGroups }
}
