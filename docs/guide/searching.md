# Searching

One free-text box, matched against your rows. Works out of the box in client mode; in server mode, it's whatever your `fetchRecords` decides `search` means.

## The state

```ts
table.search              // string, starts as ''
table.setSearch(value)
```

That's it — one string. By default, typing "d", "de", "dev" triggers three refetches, one per keystroke. Set `searchDebounceMs` to delay the actual query until typing pauses:

```ts
useDataTable({
  data: CATEGORIES, // or fetchRecords
  columns,
  getRowId: (row) => row.id,
  searchDebounceMs: 300,
})
```

`table.search` still updates on every keystroke — `<DataTable.SearchField/>` and any input you bind to it stay responsive — but the query (client-mode filtering or `fetchRecords`) waits for `searchDebounceMs` of silence before running. For a table backed by `data` (client mode), that delay usually isn't necessary — filtering an in-memory array on every keystroke is imperceptibly fast. For `fetchRecords` (server mode), a request per keystroke is usually worth avoiding, so set `searchDebounceMs` there.

## Client mode: what actually gets matched

By default, every column's `field` is checked, case-insensitively, as a substring match against string-valued fields only:

```ts
fields.some((field) => {
  const value = row[field]
  return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
})
```

Searching "true" won't match `is_active: true` — it's a boolean, not a string, so it's silently skipped, not coerced. Searching "2026-03" *will* match `created_at: '2026-03-15'`, since that field is a string and substring-matching doesn't care that it happens to be a date.

Restrict which fields get checked with `searchable: false` on a column:

```ts
columns: [
  { field: 'name', headerName: 'Name' },
  { field: 'slug', headerName: 'Slug', searchable: false }, // won't match search anymore, even though it's a string column
  ...
]
```

Worth doing when a column's raw value would produce confusing matches — searching "web-development" (someone pasted a slug) shouldn't necessarily also match on `slug` if you only want name-search from the UI's search box.

## Server mode: search means whatever you implement

`params.search` is a plain string, passed straight from `table.search`. What it matches is entirely your backend's decision — a `LIKE '%term%'` on one column, a full-text search index across several, fuzzy matching, whatever:

```ts
async function fetchCategories(params: FetchParams) {
  const { data } = await api.get('/admin/blog-categories', { params: { q: params.search } })
  return { rows: data.data, total: data.total }
}
```

An empty string (`''`, the initial state) should mean "no filter" on your backend — most `LIKE '%%'`-style queries already behave this way for free, but a hand-rolled full-text search branch might need an explicit `if (!params.search) { /* skip the search clause entirely */ }`.

## Combining with grouping

Search applies inside groups too — `fetchCategoryGroups`/`fetchCategories` both receive `params.search` regardless of whether `params.groupBy`/`params.groupKey` are set (see [Grouping](/guide/grouping)). Typing "dev" while grouped by status narrows *both* groups' counts (Active's count of 10 becomes however many active categories match "dev"), not just the currently-expanded one's rows — because `fetchGroups` runs on every search change too, same as `fetchRecords` does in flat mode.

## Next

- [Filtering](/guide/filtering) — a second, independent way to narrow the result set, alongside search rather than instead of it.
