# MUI renderer

`@kyrobit/kyro-datatable/mui` reads a `DataTableApi` and draws it with `Table`, `TableSortLabel`, `TablePagination`, and `Collapse` — nothing beyond `@mui/material` and `@mui/icons-material`, both optional peer dependencies.

## DataTable

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'

const table = useDataTable<Category, 'name' | 'created_at'>({ columns, fetchRecords, getRowId })

<DataTable
  api={table}
  columns={columns}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)}
  searchPlaceholder="Search categories"
  emptyMessage="No categories yet."
/>
```

Includes a search box, sortable headers (click to cycle asc → desc → unsorted), a "Group by" select when `groupByColumns` is set on the hook config, and `TablePagination` at the bottom.

## FavoritesMenu

A toolbar button + popover for the saved-filter-set pattern in [Favorites](/guide/favorites) — add, apply, edit, delete, reorder.

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/mui'

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={filters}
  filterEditor={(value, onChange) => <StatusFilterForm value={value} onChange={onChange} />}
  summarize={(f) => (f.statuses.length ? `Status: ${f.statuses.join(', ')}` : 'No filters')}
  onApply={setFilters}
/>
```

Reordering uses up/down icon buttons, not drag-and-drop — the library doesn't pull in `@dnd-kit` or any drag library to keep the dependency footprint small.

## Composing your own toolbar

`DataTable`'s built-in search + group-by bar is convenient, but a real admin page usually wants more: preset tabs, a Sort-by menu with explicit field/direction choices, Import/Export buttons. In that case, skip `<DataTable/>` and build the table yourself from `table.rows` / `table.sort` / `table.groupBy` directly — `DataTable`'s own source (`src/renderers/mui/DataTable.tsx`) is the reference implementation for exactly that pattern: MUI `Table` + `TableSortLabel` + grouped `Collapse` rows, wired to the same `DataTableApi`.

For an explicit field-and-direction sort menu (rather than click-to-cycle), use `table.setSort({ field, direction })` directly instead of `table.toggleSort(field)` — see the [Core API reference](/reference/core-api) for the difference.
