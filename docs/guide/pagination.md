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
| `setGroupBy(fields)` | Yes (and clears every group's loaded state — see [Grouping](/guide/grouping)) |
| `setPageSize(n)` | Yes |
| `setPage(n)` | No — this *is* the page change |
| `refetch()` | No — re-runs the exact same query |

If you're building a "Page 3 of 12" indicator and it flickers back to "Page 1 of N" the instant someone types in the search box, that's this table working as intended, not a bug to route around.

## Reading the total

`table.total` is the total row count for the *current* search/sort/filter combination — not the size of your whole dataset. In client mode (`data: CATEGORIES`), searching for "dev" against 14 categories sets `table.total` to `2` (Web Development, DevOps), not `14`. Compute total pages from it:

```ts
const totalPages = Math.max(1, Math.ceil(table.total / table.pagination.pageSize))
```

`Math.max(1, ...)` matters — with zero results, `Math.ceil(0 / pageSize)` is `0`, which shows as "page 1 of 0" in an empty-state UI instead of "page 1 of 1".

## Server mode: what you're actually responsible for

Your `fetchRecords` receives `params.page`/`params.pageSize` and must return the *right slice*, not the whole dataset with a `total`:

```ts
async function fetchCategories(params: FetchParams) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { page: params.page, per_page: params.pageSize, q: params.search },
  })
  return { rows: data.data, total: data.total } // rows: just this page. total: the full count.
}
```

If `rows` returns every matching row instead of just the current page, and the client slices it, the backend is transferring and holding the full result set on every request — no smaller than an unpaginated query. If your backend endpoint doesn't actually support `LIMIT`/`OFFSET` yet, `useDataTable`'s pagination controls will still render and respond to clicks, but every "page" will be the same unsliced response. Fix it by adding real `LIMIT`/`OFFSET` to the endpoint — client-side pagination logic can't compensate for a backend that returns everything.

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

While grouped, the table's pager pages the groups themselves, by `table.groupPageSize` (see [Many groups](/guide/grouping#many-groups)).

## Scrolling with the page

By default `infiniteScroll` scrolls rows inside a box of their own. To let the page, or the panel the table sits in, do the scrolling instead, compose the pieces and give the body `pageScroll`:

```tsx
<DataTable.Root api={table}>
  <Box sx={{ position: 'sticky', top: 'var(--title-height)', height: 56 }}>
    <DataTable.SearchField alwaysOpen />
    <DataTableGroupMenu />
  </Box>
  <Card sx={{ overflow: 'clip' }}>
    <DataTable.Body infiniteScroll pageScroll stickyTop="calc(var(--title-height) + 56px)" />
  </Card>
</DataTable.Root>
```

- The table scrolls with the nearest scrolling ancestor, or the window if there is none. It has no scrollbar of its own and is only as tall as its rows.
- `stickyTop` is where the column header pins, as any CSS length. A CSS variable lets the header follow an area above it that changes height.
- The next page still loads one screen ahead, and returning to a list with a `cacheKey` restores the same rows at the same scroll position.
- `restoreScroll={false}` (on the body or the full `<DataTable>`) opens a returning list at the top instead. Cached rows still show at once.
- Everything between the body and the scrolling element must leave overflow visible: use `overflow: 'clip'` to round a card's corners, because `hidden` or `auto` gives the header a different box to pin in.
- What pins above the table, and its background, is yours to lay out.

## Next

- [Sorting](/guide/sorting) — the other thing that resets you to page 1.
- [Grouping](/guide/grouping) — where per-page pagination stops applying, and per-group pagination takes over.
