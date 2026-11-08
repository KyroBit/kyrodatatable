# Grouping

This picks up exactly where the [quick start](/guide/quick-start) left off — same 14 categories. Instead of paging through all of them, group by status: two collapsed rows, "Active" (10) and "Inactive" (4), each loading its own page only once expanded.

Grouping works in both modes `useDataTable` supports: pass `data`, and it groups the array in memory with no extra config at all. Pass `fetchRecords`/`fetchGroups` instead, and grouping runs against your API the same way search and sort already do. Client mode first, since it's less to write — then the server-mode version, which is the one that carries over once a real backend is involved.

This is the one thing MUI X DataGrid can't do without paying for it, in either mode — row grouping is a **Premium**-only feature there, not included in Community or even Pro. It's a first-class, no-license feature here, because it's just state: a tree of groups, and a `Record<groupId, { rows, groups, total, page }>` alongside the flat list the hook already tracked.

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

Grouped mode has two different questions to answer, and they're different queries against your data: *what are the groups, and how many rows are in each* (one query, runs once) versus *what are the rows inside group X, page 2* (a different query, runs per group, only when that group is actually expanded). `fetchRecords` — the one you already wrote — answers the second question, once you pass it `groupPath` — the groups the request sits inside, outermost first. `fetchGroups` is new, and answers the first: it groups by `params.groupBy`, within `params.groupPath`.

## Extend the in-memory data

Add this to `src/categories.ts`, alongside `fetchCategories` (the [quick start's server-mode version](/guide/quick-start)):

```ts
// src/categories.ts (additions)
import type { FetchParams, FetchGroupsResult } from '@kyrobit/datatable'

export async function fetchCategoryGroups(params: FetchParams): Promise<FetchGroupsResult> {
  const rows = ALL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(params.search.toLowerCase()),
  )

  const active = rows.filter((c) => c.is_active)
  const inactive = rows.filter((c) => !c.is_active)

  await new Promise((r) => setTimeout(r, 200))

  return {
    total: 2,
    records: rows.length,
    groups: [
      { key: 'active', field: 'is_active', label: 'Active', count: active.length },
      { key: 'inactive', field: 'is_active', label: 'Inactive', count: inactive.length },
    ],
  }
}
```

And update `fetchCategories` to filter by group when it's asked to — this is the only change to the function you already had:

```ts
export async function fetchCategories(params: FetchParams) {
  let rows = ALL_CATEGORIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(params.search.toLowerCase())
    const matchesGroup = (params.groupPath ?? []).every((entry) => (entry.key === 'active') === c.is_active)
    return matchesSearch && matchesGroup
  })

  // ...sort, paginate, and the 200ms delay stay exactly as before
}
```

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

Two new fields from the quick start's server-mode call — `fetchGroups`, and `groupByColumns` to tell the renderer what grouping options exist. `<DataTable />` grows a Group button automatically; add "Status" in its panel (or call `table.setGroupBy(['is_active'])` yourself) and the flat, paginated view is replaced by the two collapsed groups.

To open the table already grouped, pass `initialGroupBy: ['is_active']`. It mounts calling `fetchGroups` only, never a flat `fetchRecords`; choosing "None" drops to the flat list, and a change in `deps` groups it again. A field missing from `groupByColumns` is ignored.

## What happens, in order, when someone expands "Active"

1. `table.toggleGroup(item.id)` flips it open. A group's id comes from its `visibleItems` entry; it encodes the group's whole path.
2. Because this is the first time that group has been expanded, it calls `fetchCategories` — the same function, not a different one — with `groupPath: [{ field: 'is_active', key: 'active' }]` set on the params.
3. Those 10 rows (page 1, whatever the page size is) land in `table.groupRows(item.id)`, entirely separate from `table.rows` (which is empty now — you're in grouped mode) and from whatever the "Inactive" group holds.
4. Collapse it, expand it again: no refetch. The rows are still there. Expand "Inactive" for the first time: *that* triggers its own fetch, with its own path and its own independent page counter.

## Many groups

Every level is a paged list, the way MUI X and AG Grid load grouped server data. `fetchGroups` receives `page` and `pageSize` and returns one page of groups, with `total` the number of groups at that level and `records` the number of records across all of them. The top level uses the table's pager (in infinite mode it loads more as you scroll); an expanded group pages its sub-groups with the same small pager a leaf group uses for its rows. Grouping by a field with hundreds of values stays one page at a time; to group dates by month instead of by day, offer a derived field such as `created_month` in `groupByColumns`.

## Nested groups

`groupBy` is a list. `table.setGroupBy(['is_active', 'country'])` groups by status, then by country inside each status. Expanding a status calls `fetchGroups` with `groupBy: 'country'` and `groupPath: [{ field: 'is_active', key: 'active' }]`; expanding a country inside it calls `fetchRecords` with both entries in `groupPath`. Every group header in `visibleItems` carries its `depth`, which the built-in renderers indent by. In `<DataTable />`, the Group button opens a panel listing the levels in order, each with a drag handle and a remove button; the unused fields sit below them as chips to add. Nothing is fetched until Apply. Every group header has a checkbox that selects the whole group without loading it, expanded or not; see [Selection](/reference/core-api#selection).

Read this state without any renderer at all via `table.groupRows`/`table.groupPagination`/`table.setGroupPage`, callable from any renderer — or your own markup.

## Reading group state without the built-in renderer

```ts
table.groups              // [{ key: 'active', label: 'Active', count: 10 }, { key: 'inactive', ... count: 4 }]
table.groupsLoading       // true while fetchGroups is in flight
const id = table.visibleItems.find((item) => item.type === 'group')!.id
table.isGroupExpanded(id)
table.toggleGroup(id)
table.groupRows(id)        // Category[] — empty until expanded at least once
table.groupTotal(id)
table.groupLoading(id)
table.groupPagination(id)  // { page, pageSize } — independent of the outer table.pagination
table.setGroupPage(id, 2)
```

## Switching away from grouping

`table.setGroupBy([])` — or "None" in the renderer's control — drops back to the flat, paginated `table.rows` view, and clears every group's loaded rows and expand state. Re-grouping later starts clean rather than showing whatever was previously expanded.

## Next

- [Favorites](/guide/favorites) — save "Active categories" as a preset instead of manually reopening that group every visit.
