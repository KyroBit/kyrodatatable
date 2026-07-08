# Core API

Everything here is exported from the root: `import { ... } from '@kyrobit/kyro-datatable'`. None of it imports a UI library. Full walkthroughs live in the guides — [Quick start](/guide/quick-start), [Server-side grouping](/guide/grouping), [Favorites](/guide/favorites) — this page is the flat reference for what each thing does.

The full Blog Categories setup from those guides, all in one place:

```ts
import { useDataTable, usePresets } from '@kyrobit/kyro-datatable'
import type { FetchParams, FetchResult, FetchGroupsResult } from '@kyrobit/kyro-datatable'

type Field = 'name' | 'created_at' | 'is_active'
type Filters = { statuses: ('active' | 'inactive')[] }

const table = useDataTable<Category, Field>({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  fetchRecords: (params: FetchParams<Field>): Promise<FetchResult<Category>> =>
    fetchCategories({ ...params, statuses: filters.statuses }),
  fetchGroups: (params: FetchParams<Field>): Promise<FetchGroupsResult<Field>> =>
    fetchCategoryGroups(params),
  getRowId: (row) => row.id,
  initialSort: { field: 'created_at', direction: 'desc' },
  initialPageSize: 25,
})

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
```

## `useDataTable(config)`

### `DataTableConfig<Row, Field>`

| Field | Type | | Description |
|---|---|---|---|
| `columns` | `ColumnDef<Row, Field>[]` | required | Passed through to whichever renderer you use. The hook itself only reads `field`, for sorting. |
| `fetchRecords` | `(params: FetchParams<Field>) => Promise<FetchResult<Row>>` | required | Called for the flat list, and again per-group with `groupBy`/`groupKey` set when a group is expanded. |
| `getRowId` | `(row: Row) => string` | required | Stable row identity, used as the React key by the built-in renderers. |
| `fetchGroups` | `(params: FetchParams<Field>) => Promise<FetchGroupsResult<Field>>` | optional | Enables grouping. Without it, `groupByColumns` has nothing to call — `groupBy` stays inert. |
| `groupByColumns` | `GroupByColumn<Field>[]` | optional | Columns offered in the renderer's "group by" control. |
| `initialPageSize` | `number` | optional | Default `25`. |
| `initialSort` | `SortState<Field> \| null` | optional | Default unsorted. |

### `FetchParams<Field>`

What your `fetchRecords`/`fetchGroups` functions receive:

| Field | Type | Notes |
|---|---|---|
| `page` | `number` | 1-indexed. |
| `pageSize` | `number` | |
| `search` | `string` | Current search text. |
| `sort` | `SortState<Field> \| null` | |
| `groupBy` | `Field \| undefined` | Set only while grouped. |
| `groupKey` | `string \| undefined` | Set only when fetching rows for one specific expanded group. |

### `DataTableApi<Row, Field>`

What `useDataTable()` returns. Every renderer — built-in or your own — works from this object alone.

| Member | Type | Notes |
|---|---|---|
| `rows`, `total`, `loading`, `error` | `Row[]`, `number`, `boolean`, `unknown` | Flat-mode result of the current page. |
| `search`, `setSearch` | `string`, `(v: string) => void` | Setting resets to page 1. |
| `sort`, `toggleSort` | `SortState<Field> \| null`, `(field: Field) => void` | `toggleSort` cycles asc → desc → unsorted on repeated calls for the *same* field; picking a new field jumps straight to asc. |
| `setSort` | `(sort: SortState<Field> \| null) => void` | Sets sort directly — use this for a menu that lets someone pick field and direction independently (see [MUI renderer](/guide/mui) for an example), rather than relying on the cycling behavior of `toggleSort`. |
| `pagination`, `setPage`, `setPageSize` | `{ page, pageSize }`, ... | 1-indexed page. |
| `groupBy`, `setGroupBy` | `Field \| null`, `(field: Field \| null) => void` | Switching groups clears all expanded/loaded group state. |
| `groups`, `groupsTotal`, `groupsLoading` | `ResourceGroup<Field>[]`, `number`, `boolean` | Top-level group list, when grouped. |
| `isGroupExpanded`, `toggleGroup` | `(key: string) => boolean`, `(key: string) => void` | Expanding for the first time triggers that group's fetch. |
| `groupRows`, `groupTotal`, `groupLoading`, `groupPagination`, `setGroupPage` | all keyed by group `key` | Fully independent per group. |
| `refetch` | `() => void` | Re-runs the current query. Call after a mutation — delete, create, edit. |

## `ColumnDef<Row, Field>`

| Field | Type | | Description |
|---|---|---|---|
| `field` | `Field` | required | Used as the sort key and (by the built-in renderers) the React key. Doesn't have to exist on `Row` — an `'actions'` column with `sortable: false` is fine. |
| `headerName` | `string` | required | Column header text. |
| `render` | `(row: Row) => unknown` | optional | Omit to read `row[field]` directly. |
| `sortable` | `boolean` | optional | Default `true`. Set `false` for computed/action columns. |
| `align` | `'left' \| 'right' \| 'center'` | optional | Cell and header alignment. |

## `usePresets(storageKey, builtIn?)`

See [Favorites](/guide/favorites) for the full walkthrough.

| Member | Type | Notes |
|---|---|---|
| `custom` | `Preset<Filters>[]` | User-saved presets, persisted to `localStorage` under `kyro-datatable:presets:<storageKey>`. |
| `all` | `Preset<Filters>[]` | `builtIn` + `custom`, in display order. |
| `builtIn` | `Preset<Filters>[]` | Exactly what you passed in — not user-editable. |
| `create(name, filters)` | `=> string` | Returns the new preset's id. |
| `update(id, name, filters)` | `=> void` | |
| `remove(id)` | `=> void` | |
| `reorder(fromIndex, toIndex)` | `=> void` | Reorders within `custom` only — built-ins stay first. |

`Preset<Filters>` is `{ id: string; name: string; filters: Filters; builtIn?: boolean }`.
