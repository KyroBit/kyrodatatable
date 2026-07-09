# Grouping

This picks up exactly where the [quick start](/guide/quick-start) left off — same 14 categories. Instead of paging through all of them, group by status: two collapsed rows, "Active" (10) and "Inactive" (4), each loading its own page only once expanded.

Grouping works in both modes `useDataTable` supports: pass `data`, and it groups the array in memory with no extra config at all. Pass `fetchRecords`/`fetchGroups` instead, and grouping runs against your API the same way search and sort already do. Client mode first, since it's less to write — then the server-mode version, which is the one that carries over once a real backend is involved.

This is the one thing MUI X DataGrid can't do without paying for it, in either mode — row grouping is a **Premium**-only feature there, not included in Community or even Pro. It's a first-class, no-license feature here, because it's just state: a list of groups, and a `Record<groupKey, { rows, total, page }>` alongside the flat list the hook already tracked.

## Client mode: nothing to write

If you're on the `data: CATEGORIES` version from the quick start, grouping is one line — `groupByColumns` — and nothing else:

```tsx
const table = useDataTable({
  data: CATEGORIES,
  columns,
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  getRowId: (row) => row.id,
})
```

`useDataTable` buckets `CATEGORIES` by `is_active` itself, counts each bucket, and serves each group's rows out of the same in-memory array once expanded — there's no `fetchGroups` to write, because there's no fetching happening at all. `<DataTable/>` grows the "Group by" control exactly the same way it does in server mode; from the renderer's side, and from `table`'s side, client-mode grouping and server-mode grouping look identical. Everything from here on describes what's happening underneath either way — the "what happens when you expand a group" walkthrough further down applies whether or not you ever write a `fetchGroups`.

## Server mode: why grouping needs a second fetch function

Grouped mode has two different questions to answer, and they're genuinely different queries against your data: *what are the groups, and how many rows are in each* (one query, runs once) versus *what are the rows inside group X, page 2* (a different query, runs per group, only when that group is actually expanded). `fetchRecords` — the one you already wrote — answers the second question, once you pass it `groupBy`/`groupKey`. `fetchGroups` is new, and answers the first.

## Extend the in-memory data

Add this to `src/categories.ts`, alongside `fetchCategories` (the [quick start's server-mode version](/guide/quick-start)):

```ts
// src/categories.ts (additions)
import type { FetchParams, FetchGroupsResult } from '@kyrobit/kyro-datatable'

type Field = 'name' | 'slug' | 'is_active' | 'created_at'

export async function fetchCategoryGroups(params: FetchParams<Field>): Promise<FetchGroupsResult<Field>> {
  const rows = ALL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(params.search.toLowerCase()),
  )

  const active = rows.filter((c) => c.is_active)
  const inactive = rows.filter((c) => !c.is_active)

  await new Promise((r) => setTimeout(r, 200))

  return {
    total: rows.length,
    groups: [
      { key: 'active', field: 'is_active', label: 'Active', count: active.length },
      { key: 'inactive', field: 'is_active', label: 'Inactive', count: inactive.length },
    ],
  }
}
```

And update `fetchCategories` to filter by group when it's asked to — this is the only change to the function you already had:

```ts
export async function fetchCategories(params: FetchParams<Field>) {
  let rows = ALL_CATEGORIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(params.search.toLowerCase())
    const matchesGroup = !params.groupKey || (params.groupKey === 'active' ? c.is_active : !c.is_active)
    return matchesSearch && matchesGroup
  })

  // ...sort, paginate, and the 200ms delay stay exactly as before
}
```

Using the library's own `FetchParams<Field>`/`FetchGroupsResult<Field>` types here, instead of hand-rolling lookalike interfaces, is what lets `useDataTable` read `Field` straight off these two functions in the next step.

## Wire it into the hook

```ts
const table = useDataTable({
  columns,
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  fetchRecords: fetchCategories,
  fetchGroups: fetchCategoryGroups,
  getRowId: (row) => row.id,
})
```

Two new fields from the quick start's server-mode call — `fetchGroups`, and `groupByColumns` to tell the renderer what grouping options exist. `<DataTable />` grows a "Group by" select automatically; pick "Status" in it (or call `table.setGroupBy('is_active')` yourself) and the flat, paginated view is replaced by the two collapsed groups.

## What happens, in order, when someone expands "Active"

1. `table.toggleGroup('active')` flips it open.
2. Because this is the first time that group has been expanded, it calls `fetchCategories` — the same function, not a different one — with `groupKey: 'active'` set on the params.
3. Those 10 rows (page 1, whatever the page size is) land in `table.groupRows('active')`, entirely separate from `table.rows` (which is empty now — you're in grouped mode) and from whatever `table.groupRows('inactive')` holds.
4. Collapse it, expand it again: no refetch. The rows are still there. Expand "Inactive" for the first time: *that* triggers its own fetch, with `groupKey: 'inactive'`, and its own independent page counter.

Read this state without any renderer at all via `table.groupRows`/`table.groupPagination`/`table.setGroupPage`, callable from any renderer — or your own markup.

## Reading group state without the built-in renderer

```ts
table.groups              // [{ key: 'active', label: 'Active', count: 10 }, { key: 'inactive', ... count: 4 }]
table.groupsLoading       // true while fetchGroups is in flight
table.isGroupExpanded('active')
table.toggleGroup('active')
table.groupRows('active') // Category[] — empty until expanded at least once
table.groupTotal('active')
table.groupLoading('active')
table.groupPagination('active') // { page, pageSize } — independent of the outer table.pagination
table.setGroupPage('active', 2)
```

## Switching away from grouping

`table.setGroupBy(null)` — or "None" in the renderer's control — drops back to the flat, paginated `table.rows` view, and clears every group's loaded rows and expand state. Re-grouping later starts clean rather than showing whatever was previously expanded.

## Next

- [Favorites](/guide/favorites) — save "Active categories" as a preset instead of manually reopening that group every visit.
