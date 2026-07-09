# Sorting

Sorting works the moment a column exists — click a header, the rows re-sort. No configuration required, same as MUI X DataGrid's sorting works "out of the box." What's worth understanding is exactly what state that click changes, and the two different ways to change it yourself.

## The data model

A table is sorted by at most one field at a time — `table.sort` is either `null` or a single `SortState<Field>`:

```ts
interface SortState<Field extends string> {
  field: Field
  direction: 'asc' | 'desc'
}
```

There's no multi-column sort — sorting by "status, then name" isn't a thing `table.sort` can represent. If you need that, sort server-side on a composite key your backend understands, and treat `field` as an opaque identifier for that composite (e.g. `field: 'status_then_name'`) rather than trying to encode two sort keys into one `SortState`.

## Two ways to change it

### `toggleSort(field)` — click-to-cycle

What every built-in renderer's column headers call. Clicking the *same* field's header cycles through three states:

```
unsorted → { field, direction: 'asc' } → { field, direction: 'desc' } → unsorted → ...
```

Clicking a *different* field's header skips straight to `{ field: newField, direction: 'asc' }` — the third click of the old field never happens, because the field changed.

```ts
table.toggleSort('name')       // null → { field: 'name', direction: 'asc' }
table.toggleSort('name')       // → { field: 'name', direction: 'desc' }
table.toggleSort('name')       // → null
table.toggleSort('created_at') // null → { field: 'created_at', direction: 'asc' }, straight in at asc
```

### `setSort(sortState)` — explicit

Sets the sort directly, no cycling. Use this when the UI lets someone pick field *and* direction independently — a menu listing "Name (A–Z)," "Name (Z–A)," "Created (Newest)" as distinct choices, rather than a column header you click repeatedly:

```tsx
<MenuItem onClick={() => table.setSort({ field: 'name', direction: 'asc' })}>Name (A–Z)</MenuItem>
<MenuItem onClick={() => table.setSort({ field: 'created_at', direction: 'desc' })}>Created (Newest)</MenuItem>
<MenuItem onClick={() => table.setSort(null)}>Unsorted</MenuItem>
```

Both `toggleSort` and `setSort` reset `table.pagination.page` to `1` — the same "what am I looking at" reasoning as `setSearch`: page 2 of a differently-sorted list isn't page 2 of anything meaningful, so there's no attempt to preserve it.

## Disabling sorting

### Per column

```ts
{ field: 'slug', headerName: 'Slug', sortable: false }
```

`sortable: false` is the *only* per-column sorting control — there's no separate "sort comparator" concept to override, because in server mode sorting happens on your server (you decide what `sort.field`/`sort.direction` mean when you write `fetchRecords`), and in client mode it's a plain `>`/`<` comparison (see below). A column that needs custom sort semantics in client mode is a column you sort on a derived, comparable value instead — see below.

### Entirely

Mark every column `sortable: false`. There's no separate hook-level "disable all sorting" flag — a column-by-column list already expresses that once every column opts out, so a second, redundant switch would just be another way to say the same thing.

## Client mode: how rows actually get compared

When `useDataTable` is given `data` instead of `fetchRecords`, sorting is:

```ts
rows.sort((a, b) => {
  const av = a[field], bv = b[field]
  if (av === bv) return 0
  return av > bv ? dir : -dir
})
```

Plain `>`/`<` — correct for strings (lexicographic, same as `created_at` ISO date strings sort correctly by string comparison) and numbers, wrong for anything that needs a custom comparison (case-insensitive strings, dates as `Date` objects rather than ISO strings, nested values). If a column needs different comparison semantics, sort on a derived field instead of the raw one:

```ts
const rows = CATEGORIES.map((c) => ({ ...c, nameLower: c.name.toLowerCase() }))
// column: { field: 'nameLower', headerName: 'Name', render: (row) => row.name }
```

The column still *displays* `row.name` via `render`; it just sorts on `nameLower`. This is the client-mode equivalent of a custom comparator — there's no separate comparator-function API, because the sort key and the sort logic are the same thing (a value comparison) once you're free to shape what value lives at `field`.

## Server mode: what you actually receive

`params.sort` in your `fetchRecords`/`fetchGroups` function is exactly `table.sort` — `null`, or `{ field, direction }`. Nothing translates it for you; map `field` to whatever your backend's sort parameter expects:

```ts
async function fetchCategories(params: FetchParams) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { sort: params.sort?.field, dir: params.sort?.direction },
  })
  return { rows: data.data, total: data.total }
}
```

If `params.sort` is `null`, `sort`/`dir` are both `undefined` in that request — decide what your backend does with an absent sort param (usually: whatever its own default ordering is, e.g. by `created_at` or by primary key).

## Reading sort state without a renderer

```ts
table.sort               // SortState<Field> | null
table.toggleSort(field)
table.setSort(sortState)
```

That's the entire surface — three members, covered in full above.

## Next

- [Pagination](/guide/pagination) — what changes when `sort` changes, page-by-page.
- [Filtering](/guide/filtering) — the other thing that resets you to page 1.
