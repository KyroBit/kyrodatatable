# Core API

Everything here is exported from the root: `import { ... } from '@kyrobit/datatable'`. None of it imports a UI library. Full walkthroughs live in the guides — [Quick start](/guide/quick-start), [Grouping](/guide/grouping), [Favorites](/guide/favorites) — this page is the flat reference for what each thing does.

The full Blog Categories setup from those guides, all in one place:

```ts
import { useDataTable, usePresets } from '@kyrobit/datatable'

type Filters = { statuses: ('active' | 'inactive')[] }
const EMPTY: Filters = { statuses: [] }

// server mode
const table = useDataTable({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  fetchRecords: fetchCategories,
  fetchGroups: fetchCategoryGroups,
  getRowId: (row) => row.id,
  initialSort: { field: 'created_at', direction: 'desc' },
  initialFilters: EMPTY,
})

// client mode — same table shape, no fetch functions, no type arguments here either
const table = useDataTable({
  data: CATEGORIES,
  columns,
  groupByColumns: [{ field: 'is_active', label: 'Status' }],
  getRowId: (row) => row.id,
  initialFilters: EMPTY,
  applyFilters: (row: Category, filters: Filters) =>
    filters.statuses.length === 0 || filters.statuses.includes(row.is_active ? 'active' : 'inactive'),
})

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
```

## `useDataTable(config)`

`useDataTable({ ... })` — no type arguments. `Row`, `Field`, and `Filters` are read from `config` itself: from `data`/`fetchRecords`, from the string literals in `columns`, and from `initialFilters`/`applyFilters`.

`config` is one of two shapes — pass `fetchRecords` (server mode) or `data` (client mode), never both, never neither. TypeScript enforces the split: `data` and `fetchRecords`/`fetchGroups` are mutually exclusive on the type.

### Fields common to both modes

| Field | Type | | Description |
|---|---|---|---|
| `columns` | `ColumnDef<Row, Field>[]` | required | Echoed back on `table.columns`, which is what renderers read. |
| `getRowId` | `(row: Row) => string` | required | Echoed back on `table.getRowId`. Stable row identity, used as the React key by the built-in renderers. |
| `groupByColumns` | `GroupByColumn<Field>[]` | optional | Echoed back on `table.groupByColumns`. Columns offered in a renderer's "group by" control. |
| `initialPageSize` | `number` | optional | Default `25`. |
| `initialSort` | `SortState<Field> \| null` | optional | Default unsorted. |
| `initialFilters` | `Filters` | optional | Seeds `table.filters`. |
| `initialGroupBy` | `Field[]` | optional | Mounts grouped by these fields, outermost first. Fields missing from `groupByColumns` are dropped. Re-applied when `deps` change. |
| `searchDebounceMs` | `number` | optional | Default `0`. Delay between a `setSearch` call and the query it triggers. `table.search` updates immediately either way. |

### Server mode — `fetchRecords`/`fetchGroups`

| Field | Type | | Description |
|---|---|---|---|
| `fetchRecords` | `(params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>` | required | Called for the flat list, and again per leaf group with `groupPath` set when that group is expanded. |
| `fetchGroups` | `(params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>` | optional | Enables grouping. Returns one page of `groups`, `total` (groups at that level) and `records` (records across them). |

### Client mode — `data`

| Field | Type | | Description |
|---|---|---|---|
| `data` | `Row[] \| undefined` | required | The whole dataset. Search, sort, pagination, and grouping all run in memory. Pass `undefined` while it is still loading, and the table shows its loading state instead of an empty one. |
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
| `groupBy` | `Field \| undefined` | Set only on `fetchGroups`: the field to group this level by. |
| `groupPath` | `GroupPathEntry<Field>[] \| undefined` | The groups the request sits inside, outermost first, as `{ field, key }`. |

### `DataTableApi<Row, Field, Filters>`

What `useDataTable()` returns. Every renderer — built-in or your own — works from this object alone.

| Member | Type | Notes |
|---|---|---|
| `columns`, `getRowId`, `groupByColumns` | — | Echoed straight back from config — see above. |
| `rows`, `total`, `loading`, `error` | `Row[]`, `number`, `boolean`, `unknown` | Flat-mode result of the current page. |
| `search`, `setSearch` | `string`, `(v: string) => void` | Setting resets to page 1. |
| `filters`, `setFilters` | `Filters \| undefined`, `(f: Filters) => void` | Setting resets to page 1 and refetches/refilters, same as `setSearch`. |
| `filterLabel`, `rememberFilterLabels` | `(field: string, value: string) => string \| undefined`, `(field: string, options: FilterOption[]) => void` | The label of a selected option, kept from when it was picked or loaded. Survives the filter menu closing and the options reloading, so chips can show "Tom Reid" for a stored id. The built-in select fields remember labels themselves; call `rememberFilterLabels` from a custom filter renderer. |
| `sort`, `toggleSort` | `SortState<Field> \| null`, `(field: Field) => void` | `toggleSort` cycles asc → desc → unsorted on repeated calls for the *same* field; picking a new field jumps straight to asc. |
| `setSort` | `(sort: SortState<Field> \| null) => void` | Sets sort directly — for a menu that lets someone pick field and direction independently, rather than relying on `toggleSort`'s cycling. |
| `pagination`, `setPage`, `setPageSize` | `{ page, pageSize }`, ... | 1-indexed page. |
| `groupBy`, `setGroupBy` | `Field[]`, `(fields: Field[]) => void` | Outermost first; empty means flat. Switching clears all expanded/loaded group state. |
| `groups`, `groupsTotal`, `groupsLoading` | `ResourceGroup<Field>[]`, `number`, `boolean` | The loaded top-level groups and how many exist. While grouped, `total` is the record count and the pager pages groups. |
| `isGroupExpanded`, `toggleGroup` | `(id: string) => boolean`, `(id: string) => void` | Expanding for the first time triggers that group's fetch. |
| `groupRows`, `groupTotal`, `groupLoading`, `groupPagination`, `setGroupPage` | all keyed by group `key` | Fully independent per group. |
| `visibleItems` | `VisibleItem<Row, Field>[]` | Flat rows, or interleaved groups + group-rows, in display order. What every built-in renderer actually iterates — see [Writing your own renderer](/guide/custom-renderer). |
| `refetch` | `() => void` | Re-runs the current query. Call after a mutation — delete, create, edit. |

### `VisibleItem<Row, Field>`

A discriminated union — `switch`/`if` on `.type`:

```ts
type VisibleItem<Row, Field> =
  | { type: 'row'; row: Row }                              // flat mode
  | { type: 'group'; id: string; group: ResourceGroup<Field>; depth: number; expanded: boolean } // group header
  | { type: 'group-row'; row: Row; groupId: string; depth: number }                            // a row inside an expanded leaf group
```

## `useFilterLabels(api, filterColumns, filters)`

Returns `(column, value) => string`: the label for a selected value, falling back to a static option's label and then the value itself. For a `select` column with an async `options` source, values with no known label are resolved once by calling the source with an empty query. The built-in select fields and `DataTableFilterChips` use it; use it in your own filter bar.

## `ColumnDef<Row, Field>`

| Field | Type | | Description |
|---|---|---|---|
| `field` | `Field` | required | Used as the sort key and (by the built-in renderers) the React key. Doesn't have to exist on `Row` — an `'actions'` column with `sortable: false` is fine. |
| `headerName` | `string` | required | Column header text. |
| `render` | `(row: Row) => unknown` | optional | Omit to read `row[field]` directly. |
| `sortable` | `boolean` | optional | Default `true`. Set `false` for computed/action columns. |
| `searchable` | `boolean` | optional | Default `true`. Set `false` to exclude this column from client-mode search matching — see [Searching](/guide/searching). |
| `align` | `'left' \| 'right' \| 'center'` | optional | Cell and header alignment. |

## Selection

Selection records what the reader picked, not which records were loaded, so a whole group or everything matching the search can be selected without fetching a row. A server resolves it into records when an action runs.

```ts
interface Selection<Field> {
  all: boolean                                                   // the header checkbox
  groups: { path: GroupPathEntry<Field>[]; selected: boolean }[] // whole groups ticked, or unticked inside a ticked parent
  rows: { id: string; selected: boolean }[]                      // single rows that differ from what contains them
}
```

A row is selected by its own entry in `rows` if it has one; otherwise by the deepest entry in `groups` whose path contains it; otherwise by `all`. `isRowSelected(selection, id, path)` applies that rule, and the built-in renderers use it, so a server written in TypeScript can share it.

| Member | Type | Notes |
|---|---|---|
| `selection`, `setSelection` | `Selection<Field>`, `(selection) => void` | |
| `selectedCount` | `number` | Worked out from `total` or the groups' `count`, minus exceptions. |
| `isSelected`, `toggleSelected` | `(id) => boolean`, `(id) => void` | |
| `allSelected`, `someSelected`, `toggleSelectAll` | `boolean`, `boolean`, `() => void` | Everything matching the current search and filters, not just the rows on screen. |
| `groupAllSelected`, `groupSomeSelected`, `toggleSelectGroup` | `(id) => boolean`, `(id) => boolean`, `(id) => void` | Independent of whether the group is expanded. |
| `clearSelection` | `() => void` | Also runs when the search, filters, grouping or `deps` change, since `all` and group entries describe one query. |

A `ResourceAction`'s `handle` receives `{ selection, count, search, filters }`; an `ExportRequest` carries `selection`. A server resolving it applies `all` to the query, then each group entry from the shallowest to the deepest, then the row entries.

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
