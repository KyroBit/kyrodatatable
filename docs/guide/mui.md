# MUI renderer

`@kyrobit/kyro-datatable/mui` is the renderer used throughout the [quick start](/guide/quick-start), [grouping](/guide/grouping), and [favorites](/guide/favorites) guides. It's built from small pieces — search field, group-by select, the table body, pagination — each reading `table` through context, with `<DataTable/>` as their default assembly. Use the assembly for the common case; compose the pieces yourself the moment you need a layout it doesn't offer.

## `<DataTable/>` — the default assembly

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'
import { CATEGORIES, type Category } from './categories'

type Field = 'name' | 'created_at'

function CategoriesPage() {
  const table = useDataTable<Category, Field>({
    data: CATEGORIES,
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ],
    getRowId: (row) => row.id,
  })

  return <DataTable api={table} onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)} searchPlaceholder="Search categories" />
}
```

This renders: a search box; a "Group by" select, automatically, only if `groupByColumns` was set on the hook config; the table, with `TableSortLabel` headers wired to `table.toggleSort`; and `TablePagination`, hidden automatically while grouped (pagination happens per-group instead — see [Grouping](/guide/grouping)).

## The pieces `<DataTable/>` is built from

Every one of these is also a static property on `DataTable` itself — `DataTable.Root`, `DataTable.SearchField`, and so on — so you never need a second import to reach for them.

| Piece | Renders |
|---|---|
| `DataTable.Root` | Nothing visible — a context provider. Everything below needs to be inside one. |
| `DataTable.SearchField` | The search `TextField`. |
| `DataTable.GroupBySelect` | The "Group by" select. Renders nothing if `groupByColumns` wasn't set. |
| `DataTable.Body` | The actual `Table`/`TableHead`/`TableBody` — sortable headers, rows, and (when grouped) expandable group headers. |
| `DataTable.Pagination` | `TablePagination`. Renders nothing while grouped. |

## Composing your own layout

This is the reason the pieces exist separately at all — a real admin screen often wants more than the default assembly offers: preset tabs above the table, an explicit Sort-by menu instead of click-to-cycle headers, Import/Export buttons. Reach for the pieces directly instead of `<DataTable/>`:

```tsx
import { DataTable } from '@kyrobit/kyro-datatable/mui'

<DataTable.Root api={table}>
  <Stack direction="row" spacing={1.5}>
    <PresetTabs presets={presets} />
    <Box sx={{ flex: 1 }} />
    <DataTable.SearchField placeholder="Search categories" />
  </Stack>
  <Stack direction="row" spacing={1}>
    <FavoritesMenu presets={presets} /* ...see Favorites */ />
    <MySortByMenu table={table} />
    <DataTable.GroupBySelect />
    <ExportButton rows={table.rows} />
  </Stack>
  <DataTable.Body onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)} />
  <DataTable.Pagination />
</DataTable.Root>
```

`DataTable.Root` is what makes this work — every piece inside it reads the same `table` via context, so you're never threading `api` through each one manually. Anything you write yourself (`PresetTabs`, `MySortByMenu`, `ExportButton` above) that needs `table` just takes it as a normal prop, same as `useDataTable`'s return value always has.

For an explicit sort menu — pick a field *and* a direction from a list, rather than relying on `toggleSort`'s asc → desc → unsorted cycle — reach for `table.setSort({ field, direction })`:

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

See [Core API](/reference/core-api) for the full `toggleSort` vs `setSort` distinction.

## `<FavoritesMenu/>`

Covered in full in [Favorites](/guide/favorites) — the short version:

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/mui'

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={table.filters ?? EMPTY}
  filterEditor={(value, onChange) => <StatusFilterForm value={value} onChange={onChange} />}
  summarize={(f) => (f.statuses.length ? `Status: ${f.statuses.join(', ')}` : 'No filters')}
  onApply={table.setFilters}
/>
```

Not part of `DataTable.Root`'s context tree — it takes `presets` directly as a prop, since `usePresets` is its own hook, independent of `useDataTable` (see [Favorites](/guide/favorites) for why). Reordering saved presets uses up/down icon buttons on hover, not drag-and-drop — deliberately, to avoid pulling `@dnd-kit` into this library's dependency tree just for that.
