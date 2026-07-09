# Filtering

Search is one free-text box, checked against everything. Filters are structured — "only active categories," "only ones created this month" — and, unlike search, `useDataTable` doesn't assume anything about their shape. This page covers holding and applying a filter value. Naming and saving one as a reusable preset is a separate concern — see [Favorites](/guide/favorites).

## Why filters are generic, and search isn't

Search is always the same shape: a string. Every table has exactly one kind of search box. Filters aren't — the Blog Categories table filters by `{ statuses: string[] }`, a different screen might filter by a date range, or three unrelated dropdowns at once. Baking one shape into `useDataTable` means it's wrong for most screens; leaving it out entirely means every screen reinvents "narrow the result set by something structured" from scratch. The middle ground: `useDataTable<Row, Field, Filters>` takes `Filters` as a third type parameter, and `table.filters`/`table.setFilters` are typed to match whatever you pass.

## Declaring the shape

```ts
type Filters = { statuses: ('active' | 'inactive')[] }

const table = useDataTable<Category, Field, Filters>({
  data: CATEGORIES,
  columns,
  getRowId: (row) => row.id,
  initialFilters: { statuses: [] },
})
```

Without `initialFilters`, `table.filters` starts as `undefined` — not an empty object matching your `Filters` shape, genuinely `undefined`, since `useDataTable` has no way to construct a valid empty value of a type it doesn't understand. If your `Filters` type doesn't tolerate `undefined` gracefully in the places you read it, always pass `initialFilters`.

## Setting it

```ts
table.setFilters({ statuses: ['active'] })
```

One call, replaces the whole `Filters` object — there's no `patchFilters` that merges a partial update in. Merge yourself if that's what you want:

```ts
table.setFilters({ ...table.filters, statuses: [...(table.filters?.statuses ?? []), 'active'] })
```

Like `setSearch` and `toggleSort`/`setSort`, `setFilters` resets `pagination.page` to `1` — see [Pagination](/guide/pagination#what-else-resets-you-to-page-1) for the full list of what does and doesn't.

## Client mode: `applyFilters` is required to do anything

Setting `table.filters` in client mode changes nothing on its own — `useDataTable` doesn't know what a `Filters` value means, so without `applyFilters`, the filter is tracked but silently has zero effect on `table.rows`. Give it a predicate:

```ts
useDataTable<Category, Field, Filters>({
  data: CATEGORIES,
  columns,
  getRowId: (row) => row.id,
  initialFilters: { statuses: [] },
  applyFilters: (row, filters) =>
    filters.statuses.length === 0 || filters.statuses.includes(row.is_active ? 'active' : 'inactive'),
})
```

`applyFilters` runs per-row, alongside the search substring check — a row has to pass *both* to appear. An empty `statuses: []` meaning "no filter, show everything" is a convention this example chose, not something the library enforces; if your `Filters` type has a different "no-op" value, `applyFilters` just needs to treat that value as always-true, the same way this one does for an empty array.

## Server mode: it's just another param

No `applyFilters` needed — `table.filters` is included in `FetchParams` exactly like `search` and `sort` already are, and what it means is entirely up to your `fetchRecords`:

```ts
async function fetchCategories(params: FetchParams<Field, Filters>) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { q: params.search, statuses: params.filters?.statuses, sort: params.sort?.field },
  })
  return { rows: data.data, total: data.total }
}
```

`params.filters` can be `undefined` (if `initialFilters` was never set) — guard accordingly, same as `params.sort` being `null` needs `params.sort?.field` rather than `params.sort.field`.

## Combining with grouping

Same rule as search (see [Searching](/guide/searching#combining-with-grouping)): filters apply inside `fetchGroups` too. Filtering to "Active" while grouped by status doesn't just narrow the Active group's rows — since every category outside the filter is excluded before grouping happens, the Inactive group's count drops to `0` and (depending on how your `fetchGroups` is written) may disappear from `table.groups` entirely rather than show as an empty, expandable group.

## Reading filter state without a renderer

```ts
table.filters      // Filters | undefined
table.setFilters(next)
```

Two members. Everything else on this page is behavior, not surface area.

## Next

- [Favorites](/guide/favorites) — name a `Filters` value, save it, reapply it with one click.
- [Grouping](/guide/grouping) — how filters and search combine with `fetchGroups`.
