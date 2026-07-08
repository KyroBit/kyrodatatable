# Reference — MUI

`import { ... } from '@kyrobit/kyro-datatable/mui'`

## `<DataTable />`

| Prop | Type | | Description |
|---|---|---|---|
| `api` | `DataTableApi<Row, Field>` | required | The object returned by `useDataTable`. |
| `columns` | `ColumnDef<Row, Field>[]` | required | Same array you passed into the hook. |
| `getRowId` | `(row: Row) => string` | required | Same as the hook config. |
| `groupByColumns` | `GroupByColumn<Field>[]` | optional | Renders the "Group by" select when present. |
| `onRowClick` | `(row: Row) => void` | optional | Rows render as clickable, with a hover state, when set. |
| `searchPlaceholder` | `string` | optional | Default `"Search…"`. |
| `emptyMessage` | `string` | optional | Default `"No records found."` |

## `<FavoritesMenu />`

| Prop | Type | | Description |
|---|---|---|---|
| `presets` | `PresetsApi<Filters>` | required | From `usePresets`. |
| `activeId` | `string \| null` | required | Which preset (if any) currently matches the applied filters — compute this yourself, see [Favorites](/guide/favorites). |
| `currentFilters` | `Filters` | required | Seeds the "Add" form with whatever's currently applied. |
| `filterEditor` | `(value: Filters, onChange: (next: Filters) => void) => ReactNode` | required | The form rendered inside Add/Edit — this is the one piece that's genuinely yours. |
| `summarize` | `(filters: Filters) => string` | required | One-line description shown under each saved preset's name. |
| `onApply` | `(filters: Filters) => void` | required | Called when a preset row is clicked. |
| `label` | `string` | optional | Button text. Default `"Favorites"`. |

Reordering is up/down icon buttons on hover, not drag-and-drop — no `@dnd-kit` dependency.
