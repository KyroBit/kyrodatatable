import type { FetchParams, FetchResult, FilterValues, ServerDataTableConfig } from '../types/index.js'

const DEFAULT_PAGE_SIZE = 25
const PREFETCH_COOLDOWN_MS = 1000

const results = new Map<string, FetchResult<unknown>>()
const running = new Map<string, Promise<FetchResult<unknown>>>()
const finishedAt = new Map<string, number>()

type FirstPageOptions<Field extends string, Filters> = Pick<
  ServerDataTableConfig<unknown, Field, Filters>, 'initialPageSize' | 'initialSort' | 'initialFilters'
>

export const firstPage = <Field extends string, Filters>(options: FirstPageOptions<Field, Filters>): FetchParams<Field, Filters> => ({
  page: 1,
  pageSize: options.initialPageSize ?? DEFAULT_PAGE_SIZE,
  search: '',
  sort: options.initialSort ?? null,
  filters: options.initialFilters as Filters,
})

export const entryKey = (cacheKey: string, params: FetchParams<string, unknown>) =>
  JSON.stringify([cacheKey, params.page, params.pageSize, params.search, params.sort, params.filters ?? null])

export const cachedResult = <Row>(key: string) => results.get(key) as FetchResult<Row> | undefined

export function load<Row>(key: string, request: () => Promise<FetchResult<Row>>): Promise<FetchResult<Row>> {
  const existing = running.get(key)
  if (existing) return existing as Promise<FetchResult<Row>>
  const pending = request()
    .then((result) => {
      results.set(key, result)
      return result
    })
    .finally(() => {
      running.delete(key)
      finishedAt.set(key, Date.now())
    })
  running.set(key, pending)
  return pending
}

export interface PrefetchOptions<Row, Field extends string, Filters> extends FirstPageOptions<Field, Filters> {
  cacheKey: string
  fetchRecords: ServerDataTableConfig<Row, Field, Filters>['fetchRecords']
}

export function prefetchDataTable<Row, Field extends string = string, Filters = FilterValues>(
  options: PrefetchOptions<Row, Field, Filters>,
): void {
  const params = firstPage(options)
  const key = entryKey(options.cacheKey, params)
  if (running.has(key) || Date.now() - (finishedAt.get(key) ?? -Infinity) < PREFETCH_COOLDOWN_MS) return
  load(key, () => options.fetchRecords(params)).catch(() => {})
}
