# Pagination

## The data model

```ts
interface PaginationState {
  page: number     // 1-indexed
  pageSize: number
}
```

`page` starts at `1`, not `0`. This is a deliberate choice, not an oversight — `table.pagination.page` is meant to be shown to a user directly ("Page 3 of 12"), and most `LIMIT`/`OFFSET` APIs (including every one used in these docs' examples) already expect a 1-indexed page number. If your renderer's underlying component expects 0-indexed pages instead (MUI's own `TablePagination` does — its `page` prop is 0-indexed), convert at the boundary: `./mui`'s `DataTable.Pagination` does exactly this internally, passing `page={table.pagination.page - 1}` and `onPageChange={(_, p) => table.setPage(p + 1)}`.

## Setting it

```ts
table.setPage(3)          // jump to page 3
table.setPageSize(50)     // change page size, and reset to page 1
```

`setPageSize` resets to page `1` — deliberately. There's no attempt to compute "which page would show the same first row at the new page size" (e.g. staying on "row 41" when page size changes from 25 to 10 would mean landing on page 5). That calculation is themselves ambiguous the moment sorting or filtering has narrowed the set, so the simpler, predictable rule wins: change the page size, land back at the top.

## What else resets you to page 1

Every one of these calls resets `pagination.page` to `1`, for the same reason: the current page number describes a position in a specific *result set*, and changing the search term, the sort, the filters, or the active group invalidates what that position meant.

| Action | Resets to page 1? |
|---|---|
| `setSearch(value)` | Yes |
| `toggleSort` / `setSort` | Yes |
| `setFilters(next)` | Yes |
| `setGroupBy(field)` | Yes (and clears every group's loaded state — see [Grouping](/guide/grouping)) |
| `setPageSize(n)` | Yes |
| `setPage(n)` | No — this *is* the page change |
| `refetch()` | No — re-runs the exact same query |

If you're building a "Page 3 of 12" indicator and it flickers back to "Page 1 of N" the instant someone types in the search box, that's this table working as intended, not a bug to route around.

## Reading the total

`table.total` is the total row count for the *current* search/sort/filter combination — not the size of your whole dataset. In client mode (`data: CATEGORIES`), searching for "dev" against 14 categories sets `table.total` to `2` (Web Development, DevOps), not `14`. Compute total pages from it:

```ts
const totalPages = Math.max(1, Math.ceil(table.total / table.pagination.pageSize))
```

`Math.max(1, ...)` matters — with zero results, `Math.ceil(0 / pageSize)` is `0`, and "page 1 of 0" reads worse than "page 1 of 1" in an empty-state UI.

## Server mode: what you're actually responsible for

Your `fetchRecords` receives `params.page`/`params.pageSize` and must return the *right slice*, not the whole dataset with a `total`:

```ts
async function fetchCategories(params: FetchParams<Field>) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { page: params.page, per_page: params.pageSize, q: params.search },
  })
  return { rows: data.data, total: data.total } // rows: just this page. total: the full count.
}
```

A common mistake worth naming explicitly: returning every matching row in `rows` and letting the client slice them defeats the entire point of server-side pagination (you've paid the cost of transferring and holding the full result set, gained nothing). If your backend endpoint doesn't actually support `LIMIT`/`OFFSET` yet, `useDataTable`'s pagination controls will still render and respond to clicks — they just won't visibly change anything, since every "page" is the same unsliced response. That's a backend gap, not something client-side pagination logic can paper over; if you notice this happening, the fix is adding real `LIMIT`/`OFFSET` to the endpoint, not working around it in the frontend.

## Client mode: this part is automatic

```ts
const start = (page - 1) * pageSize
return { rows: filtered.slice(start, start + pageSize), total: filtered.length }
```

`total` is computed *after* search/filter/group narrowing but *before* the `.slice()` — exactly the distinction in [Reading the total](#reading-the-total) above, just spelled out as code instead of prose.

## Per-group pagination

Once a table is grouped, `table.pagination` stops being what's shown — each expanded group has its own, entirely independent page counter. See [Grouping](/guide/grouping) for the full walkthrough; the short version:

```ts
table.groupPagination('active')       // { page, pageSize } — this group's own state
table.setGroupPage('active', 2)       // page 2 of "Active" specifically
```

`table.pagination`/`setPage`/`setPageSize` still exist while grouped, but `<DataTable/>`'s `Pagination` piece hides itself in that state (`api.groupBy` is set) — there's nothing meaningful to paginate at the top level once the view is a list of collapsible groups instead of a list of rows.

## Next

- [Sorting](/guide/sorting) — the other thing that resets you to page 1.
- [Grouping](/guide/grouping) — where per-page pagination stops applying, and per-group pagination takes over.
