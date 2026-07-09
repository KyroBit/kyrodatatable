# Core API

Everything here is exported from the root: `import { ... } from '@kyrobit/kyro-datatable'`. None of it imports a UI library. Full walkthroughs live in the guides — [Quick start](/guide/quick-start), [Grouping](/guide/grouping), [Favorites](/guide/favorites) — this page is the flat reference for what each thing does.

The full Blog Categories setup from those guides, all in one place:

```ts
import { useDataTable, usePresets } from '@kyrobit/kyro-datatable'
import type { FetchParams, FetchResult, FetchGroupsResult } from '@kyrobit/kyro-datatable'

type Field = 'name' | 'created_at' | 'is_active'
type Filters = { statuses: ('active' | 'inactive')[] }

// server mode
const table = useDataTable<Category, Field, Filters>({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  fetchRecords: (params: FetchParams<Field, Filters>): Promise<FetchResult<Category>> => fetchCategories(params),
  fetchGroups: (params: FetchParams<Field, Filters>): Promise<FetchGroupsResult<Field>> => fetchCategoryGroups(params),
  getRowId: (row) => row.id,
  initialSort: { field: 'created_at', direction: 'desc' },
  initialFilters: { statuses: [] },
})

// client mode — same table shape, no fetch functions
const table = useDataTable<Category, Field, Filters>({
  data: CATEGORIES,
  columns,
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  getRowId: (row) => row.id,
  applyFilters: (row, filters) => filters.statuses.length === 0 || filters.statuses.includes(row.is_active ? 'active' : 'inactive'),
})

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
```

## `useDataTable(config)`

`config` is one of two shapes — pass `fetchRecords` (server mode) or `data` (client mode), never both, never neither. TypeScript enforces the split: `data` and `fetchRecords`/`fetchGroups` are mutually exclusive on the type.

### Fields common to both modes

| Field | Type | | Description |
|---|---|---|---|
| `columns` | `ColumnDef<Row, Field>[]` | required | Echoed back on `table.columns` — renderers read it from there, not from a second copy you pass them. |
| `getRowId` | `(row: Row) => string` | required | Echoed back on `table.getRowId`. Stable row identity, used as the React key by the built-in renderers. |
| `groupByColumns` | `GroupByColumn<Field>[]` | optional | Echoed back on `table.groupByColumns`. Columns offered in a renderer's "group by" control. |
| `initialPageSize` | `number` | optional | Default `25`. |
| `initialSort` | `SortState<Field> \| null` | optional | Default unsorted. |
| `initialFilters` | `Filters` | optional | Seeds `table.filters`. |

### Server mode — `fetchRecords`/`fetchGroups`

| Field | Type | | Description |
|---|---|---|---|
| `fetchRecords` | `(params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>` | required | Called for the flat list, and again per-group with `groupBy`/`groupKey` set when a group is expanded. |
| `fetchGroups` | `(params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>` | optional | Enables grouping. Without it, `groupByColumns` has nothing to call — `groupBy` stays inert. |

### Client mode — `data`

| Field | Type | | Description |
|---|---|---|---|
| `data` | `Row[]` | required | The whole dataset, already loaded. Search, sort, pagination, and grouping all run in memory. |
| `searchFields` | `Field[]` | optional | Which fields to substring-match against `search`. Defaults to every column's `field`. |
| `applyFilters` | `(row: Row, filters: Filters) => boolean` | optional | Only needed if you also use `filters` in client mode — there's no generic default, since a filter's shape is yours. |

### `FetchParams<Field, Filters>`

What your `fetchRecords`/`fetchGroups` functions receive:

| Field | Type | Notes |
|---|---|---|
| `page` | `number` | 1-indexed. |
| `pageSize` | `number` | |
| `search` | `string` | Current search text. |
| `sort` | `SortState<Field> \| null` | |
| `filters` | `Filters` | Whatever `table.filters` currently holds. |
| `groupBy` | `Field \| undefined` | Set only while grouped. |
| `groupKey` | `string \| undefined` | Set only when fetching rows for one specific expanded group. |

### `DataTableApi<Row, Field, Filters>`

What `useDataTable()` returns. Every renderer — built-in or your own — works from this object alone.

| Member | Type | Notes |
|---|---|---|
| `columns`, `getRowId`, `groupByColumns` | — | Echoed straight back from config — see above. |
| `rows`, `total`, `loading`, `error` | `Row[]`, `number`, `boolean`, `unknown` | Flat-mode result of the current page. |
| `search`, `setSearch` | `string`, `(v: string) => void` | Setting resets to page 1. |
| `filters`, `setFilters` | `Filters \| undefined`, `(f: Filters) => void` | Setting resets to page 1 and refetches/refilters, same as `setSearch`. |
| `sort`, `toggleSort` | `SortState<Field> \| null`, `(field: Field) => void` | `toggleSort` cycles asc → desc → unsorted on repeated calls for the *same* field; picking a new field jumps straight to asc. |
| `setSort` | `(sort: SortState<Field> \| null) => void` | Sets sort directly — for a menu that lets someone pick field and direction independently, rather than relying on `toggleSort`'s cycling. |
| `pagination`, `setPage`, `setPageSize` | `{ page, pageSize }`, ... | 1-indexed page. |
| `groupBy`, `setGroupBy` | `Field \| null`, `(field: Field \| null) => void` | Switching groups clears all expanded/loaded group state. |
| `groups`, `groupsTotal`, `groupsLoading` | `ResourceGroup<Field>[]`, `number`, `boolean` | Top-level group list, when grouped. |
| `isGroupExpanded`, `toggleGroup` | `(key: string) => boolean`, `(key: string) => void` | Expanding for the first time triggers that group's fetch. |
| `groupRows`, `groupTotal`, `groupLoading`, `groupPagination`, `setGroupPage` | all keyed by group `key` | Fully independent per group. |
| `visibleItems` | `VisibleItem<Row, Field>[]` | Flat rows, or interleaved groups + group-rows, in display order. What every built-in renderer actually iterates — see [Writing your own renderer](/guide/custom-renderer). |
| `refetch` | `() => void` | Re-runs the current query. Call after a mutation — delete, create, edit. |

### `VisibleItem<Row, Field>`

A discriminated union — `switch`/`if` on `.type`:

```ts
type VisibleItem<Row, Field> =
  | { type: 'row'; row: Row }                              // flat mode
  | { type: 'group'; group: ResourceGroup<Field>; expanded: boolean } // group header
  | { type: 'group-row'; row: Row; groupKey: string }       // a row inside an expanded group
```

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
