# MUI renderer

`@kyrobit/kyro-datatable/mui` is the renderer used throughout the [quick start](/guide/quick-start), [grouping](/guide/grouping), and [favorites](/guide/favorites) guides. It reads a `DataTableApi` and draws it with `Table`, `TableSortLabel`, `TablePagination`, and `Collapse` — nothing beyond `@mui/material` and `@mui/icons-material`, both optional peer dependencies (see [Installation](/guide/installation)).

## `<DataTable />`

The full component, wired to the Blog Categories example:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'
import { fetchCategories, type Category } from './categories'

type Field = 'name' | 'created_at'

const columns = [
  { field: 'name' as const, headerName: 'Name' },
  { field: 'created_at' as const, headerName: 'Created', render: (row: Category) => new Date(row.created_at).toLocaleDateString() },
]

function CategoriesPage() {
  const table = useDataTable<Category, Field>({ columns, fetchRecords: fetchCategories, getRowId: (r) => r.id })

  return (
    <DataTable
      api={table}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)}
      searchPlaceholder="Search categories"
      emptyMessage="No categories yet."
    />
  )
}
```

What it renders, top to bottom: a search box; a "Group by" select, only if `groupByColumns` was set on the hook config; a `Table` with `TableSortLabel` headers (click to cycle asc → desc → unsorted, per column, matching `table.toggleSort`); the rows, or — when grouped — collapsed group headers that expand into their own nested rows via `Collapse`; and `TablePagination` at the bottom, hidden automatically while grouped, since pagination in grouped mode happens per-group instead (see [Server-side grouping](/guide/grouping)).

## `<FavoritesMenu />`

Covered in full in [Favorites](/guide/favorites) — the short version:

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

Renders as a small `Button` + MUI `Popover`. Reordering saved presets uses up/down icon buttons on hover, not drag-and-drop — deliberately, to avoid pulling `@dnd-kit` into this library's dependency tree just for that.

## When `<DataTable />`'s built-in toolbar isn't enough

`<DataTable />`'s search bar and group-by select cover the common case, but a real admin screen often wants more at once: preset tabs above the table, a "Sort by" menu with explicit field-and-direction choices instead of click-to-cycle, Import/Export buttons. That's not a prop `<DataTable />` exposes — at that point, don't use `<DataTable />` at all. Build the table with plain MUI `Table`/`TableRow`/`TableCell` yourself, reading `table.rows`, `table.sort`, `table.groupBy`, etc. directly, the same way `src/renderers/mui/DataTable.tsx` does internally. That file is meant to be read, not just imported — it's the reference implementation for exactly this pattern, and copying its group-row `Collapse` structure into your own hand-built table is the intended way to get grouping in a fully custom toolbar.

For an explicit sort menu (pick a field *and* a direction from a list, rather than relying on `toggleSort`'s asc → desc → unsorted cycle), reach for `table.setSort({ field, direction })` instead:

```tsx
{SORT_FIELDS.flatMap((f) => (['asc', 'desc'] as const).map((dir) => (
  <MenuItem
    key={`${f.key}-${dir}`}
    selected={table.sort?.field === f.key && table.sort.direction === dir}
    onClick={() => table.setSort({ field: f.key, direction: dir })}
  >
    {f.label} ({dir === 'asc' ? 'A–Z' : 'Z–A'})
  </MenuItem>
)))}
```

See [Core API](/reference/core-api) for the difference between `toggleSort` and `setSort`.
