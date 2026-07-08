# Bootstrap renderer

`@kyrobit/kyro-datatable/bootstrap` reads the exact same `DataTableApi` as `./mui` and draws it with plain HTML and Bootstrap's own utility classes — `table`, `table-hover`, `form-control`, `btn`, `pagination`. No `bootstrap` or `react-bootstrap` npm package, no JS bundle from Bootstrap at all. Your app just needs Bootstrap's CSS loaded globally, same as any other page using those classes.

## DataTable

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/bootstrap'

const table = useDataTable<Category, 'name' | 'created_at'>({ columns, fetchRecords, getRowId })

<DataTable api={table} columns={columns} getRowId={(row) => row.id} />
```

Identical props to the MUI version — `onRowClick`, `searchPlaceholder`, `emptyMessage`, all the same. Sort indicators use plain arrow characters (`↑`/`↓`/`↕`) rather than an icon font, so nothing extra needs loading for those either.

## FavoritesMenu

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/bootstrap'

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={filters}
  filterEditor={(value, onChange) => <StatusFilterForm value={value} onChange={onChange} />}
  summarize={(f) => (f.statuses.length ? `Status: ${f.statuses.join(', ')}` : 'No filters')}
  onApply={setFilters}
/>
```

Renders as a dropdown card anchored under the button (`position: absolute`), not a Bootstrap `Popover`/`Dropdown` JS component — so it needs no Bootstrap JavaScript bundle either, just the CSS.

## Why two renderers with one props contract

Both `./mui` and `./bootstrap` implement the same `DataTableProps<Row, Field>` shape on purpose — switching from one design system to another (or supporting both across different internal tools) is a one-line import change, not a rewrite. See [Writing your own renderer](/guide/custom-renderer) if neither fits.
