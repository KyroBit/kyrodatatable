const DEFAULT_PAGE_SIZE = 25;
const PREFETCH_COOLDOWN_MS = 1000;
const results = new Map();
const running = new Map();
const finishedAt = new Map();
export const firstPage = options => ({
  page: 1,
  pageSize: options.initialPageSize ?? DEFAULT_PAGE_SIZE,
  search: '',
  sort: options.initialSort ?? null,
  filters: options.initialFilters
});
export const entryKey = (cacheKey, params) => JSON.stringify([cacheKey, params.page, params.pageSize, params.search, params.sort, params.filters ?? null]);
export const cachedResult = key => results.get(key);
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