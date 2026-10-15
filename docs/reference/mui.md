# Reference — MUI

`import { ... } from '@kyrobit/datatable/mui'`

## `<DataTable/>`

The default assembly — `Root` + `SearchField` + `GroupBySelect` + `Body` + `Pagination`, in that layout. See [the MUI guide](/guide/mui) for building a different layout from the same pieces.

| Prop | Type | | Description |
|---|---|---|---|
| `api` | `DataTableApi<Row, Field, Filters>` | required | The object returned by `useDataTable`. |
| `onRowClick` | `(row: Row) => void` | optional | Rows render as clickable, with a hover state, when set. |
| `searchPlaceholder` | `string` | optional | Default `"Search…"`. |
| `emptyMessage` | `ReactNode` | optional | Shown in place of the table when there are no records at all. Default `"No records found."` |
| `noResultsMessage` | `ReactNode` | optional | Shown in place of the table when a search or filter matches nothing. Default `"No records match your search."` |
| `errorMessage` | `ReactNode` | optional | Shown in place of the table when the fetch fails. Defaults to a message with a "Try again" button that calls `api.refetch()`. |
| `settings` | `boolean` | optional | Default `true`. Pass `false` to drop the settings button and its dialog, where a table has one fixed column set and nothing to configure. |

## The primitives

Each is also a static property on `DataTable` — `DataTable.Root`, `DataTable.SearchField`, etc.

### `DataTable.Root` (`DataTableRoot`)

| Prop | Type | | Description |
|---|---|---|---|
| `api` | `DataTableApi<Row, Field, Filters>` | required | Made available to every piece below it via context. |
| `children` | `ReactNode` | required | |

Every other primitive throws a clear error if rendered outside a `Root`.

### `DataTable.SearchField` (`DataTableSearchField`)

| Prop | Type | Default |
|---|---|---|
| `placeholder` | `string` | `"Search…"` |
| ...rest | `TextFieldProps` | forwarded to the underlying MUI `TextField` |

### `DataTable.GroupBySelect` (`DataTableGroupBySelect`)

| Prop | Type | Default |
|---|---|---|
| `noneLabel` | `string` | `"None"` |

Renders nothing if `groupByColumns` wasn't set on the hook config — there's nothing to offer.

### `DataTable.Body` (`DataTableBody`)

| Prop | Type | | Description |
|---|---|---|---|
| `onRowClick` | `(row: Row) => void` | optional | |
| `emptyMessage` | `ReactNode` | optional | Default `"No records found."` |
| `noResultsMessage` | `ReactNode` | optional | Default `"No records match your search."` |
| `errorMessage` | `ReactNode` | optional | Defaults to a message with a "Try again" button. |

While a fetch with no rows on screen is loading, the body renders the real headers over up to ten placeholder rows. A list that has rows keeps them until the next result arrives, and an empty message only ever describes a finished result.

Iterates `api.visibleItems` — see [Core API](/reference/core-api) — so grouped and flat rendering share one path.

### `DataTable.Pagination` (`DataTablePagination`)

No props. Renders `TablePagination` bound to `api.pagination`/`api.total`. Invisible, but still taking its space, while `api.total` is 0. Renders nothing while `api.groupBy` is set.

## `<FavoritesMenu/>`

Not part of `Root`'s context tree — takes `presets` directly, since `usePresets` is independent of `useDataTable` (see [Favorites](/guide/favorites)).

| Prop | Type | | Description |
|---|---|---|---|
| `presets` | `PresetsApi<Filters>` | required | From `usePresets`. |
| `activeId` | `string \| null` | required | Which preset (if any) currently matches the applied filters — compute this yourself. |
| `currentFilters` | `Filters` | required | Seeds the "Add" form with whatever's currently applied. |
| `filterEditor` | `(value: Filters, onChange: (next: Filters) => void) => ReactNode` | required | The form rendered inside Add/Edit — the one piece that's yours. |
| `summarize` | `(filters: Filters) => string` | required | One-line description shown under each saved preset's name. |
| `onApply` | `(filters: Filters) => void` | required | Called when a preset row is clicked — typically `table.setFilters`. |
| `label` | `string` | optional | Button text. Default `"Favorites"`. |

Reordering is up/down icon buttons on hover, not drag-and-drop — no `@dnd-kit` dependency.
