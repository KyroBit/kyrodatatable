# Server-side grouping

The Blog Categories table has an obvious grouping dimension: `is_active`. Instead of scrolling through every category, group by status — two collapsed rows, "Active" and "Inactive," each showing a count, each loading its own rows only once expanded.

This is the one thing MUI X DataGrid can't do for free — row grouping is a **Premium** (paid) feature there, not included in Community or even Pro. It's a first-class, no-license feature here.

## Two things you add

`groupByColumns` tells the renderer what grouping options to offer. `fetchGroups` is a second fetch function — it returns the list of groups, not rows.

```ts
import type { FetchParams, FetchGroupsResult } from '@kyrobit/kyro-datatable'

async function fetchCategoryGroups(
  params: FetchParams<'name' | 'created_at' | 'is_active'>,
): Promise<FetchGroupsResult<'name' | 'created_at' | 'is_active'>> {
  const { data } = await api.get('/admin/blog-categories/group-by', {
    params: { field: params.groupBy, q: params.search },
  })
  // data: { total: number, groups: [{ key: 'active', field: 'is_active', label: 'Active', count: 12 }, ...] }
  return data
}

const table = useDataTable({
  columns,
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  fetchRecords: fetchCategories,
  fetchGroups: fetchCategoryGroups,
  getRowId: (row) => row.id,
})
```

That's it — the MUI and Bootstrap renderers both grow a "Group by" control automatically once `groupByColumns` is set.

## What happens when someone expands a group

1. `table.toggleGroup('active')` flips that group open.
2. The very first time, it calls your **existing** `fetchRecords` — the same function you already wrote — but now with `groupBy: 'is_active'` and `groupKey: 'active'` set on the params.
3. That group gets its own `rows`, `total`, `loading`, and `pagination` — entirely independent of every other group. Collapsing and re-expanding doesn't refetch what's already loaded.

Your `fetchRecords` just needs to read `params.groupKey` and filter by it:

```ts
async function fetchCategories(params) {
  const { data } = await api.get('/admin/blog-categories', {
    params: {
      q: params.search,
      sort: params.sort?.field,
      dir: params.sort?.direction,
      page: params.page,
      per_page: params.pageSize,
      status: params.groupKey, // only set when fetching rows inside an expanded group
    },
  })
  return { rows: data.data, total: data.total }
}
```

## Reading group state yourself

If you're writing a custom renderer instead of using `./mui`/`./bootstrap`:

```ts
table.groups              // ResourceGroup[] — the collapsed list
table.isGroupExpanded(key)
table.toggleGroup(key)
table.groupRows(key)      // Row[] for that group, once loaded
table.groupTotal(key)
table.groupLoading(key)
table.setGroupPage(key, 2) // page within that specific group
```

## Switching away from grouping

Calling `table.setGroupBy(null)` (or picking "None" in the renderer's group control) drops back to the flat, paginated view — and clears every group's loaded state, so re-grouping later starts fresh rather than showing stale data.
