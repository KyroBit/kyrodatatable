const DEFAULT_PAGE_SIZE = 25;
const PREFETCH_COOLDOWN_MS = 1000;
const results = new Map();
const running = new Map();
const finishedAt = new Map();
const lastPages = new Map();
export const firstPage = options => ({
  page: 1,
  pageSize: options.initialPageSize ?? DEFAULT_PAGE_SIZE,
  search: '',
  sort: options.initialSort ?? null,
  filters: options.initialFilters
});
export const entryKey = (cacheKey, params) => JSON.stringify([cacheKey, params.page, params.pageSize, params.search, params.sort, params.filters ?? null]);
const cachedResult = key => results.get(key);
export function cachedList(cacheKey, params) {
  const key = entryKey(cacheKey, params);
  const first = cachedResult(key);
  if (!first) return undefined;
  const list = {
    rows: first.rows,
    total: first.total,
    lastPage: params.page
  };
  const wanted = lastPages.get(key) ?? params.page;
  while (list.lastPage < wanted) {
    const next = cachedResult(entryKey(cacheKey, {
      ...params,
      page: list.lastPage + 1
    }));
    if (!next) break;
    list.rows = [...list.rows, ...next.rows];
    list.total = next.total;
    list.lastPage += 1;
  }
  return list;
}
export const rememberLastPage = (listKey, page) => lastPages.set(listKey, page);
export function load(key, request) {
  const existing = running.get(key);
  if (existing) return existing;
  const pending = request().then(result => {
    results.set(key, result);
    return result;
  }).finally(() => {
    running.delete(key);
    finishedAt.set(key, Date.now());
  });
  running.set(key, pending);
  return pending;
}
export function prefetchDataTable(options) {
  const params = firstPage(options);
  const key = entryKey(options.cacheKey, params);
  if (running.has(key) || Date.now() - (finishedAt.get(key) ?? -Infinity) < PREFETCH_COOLDOWN_MS) return;
  load(key, () => options.fetchRecords(params)).catch(() => {});
}