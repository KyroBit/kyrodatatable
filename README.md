# @kyrobit/datatable

Headless data-table state — pagination, sorting, search, filtering, grouping (client-side or server-side), and saved filter presets ("Favorites") — fully decoupled from rendering. A UI-agnostic core, with optional renderers for whichever library you're actually using.

`useDataTable` owns 100% of the state and has never imported a UI library. `./mui` is just a component that reads that state and draws markup — it isn't required, and it isn't special. Write your own the same way if you need one.

## Why

MUI X DataGrid's server-side row grouping sits behind the **Premium** license — not included in Community, not included in Pro. It's free and built in here.

## Install

Not published to a registry — link it locally:

```bash
cd kyro-datatable && bun run build && bun link
cd your-app && bun link @kyrobit/datatable
```

`react`/`react-dom` are required peers. `@mui/material` is **optional** — only resolved via `./mui`.

## At a glance

```tsx
import { useDataTable } from '@kyrobit/datatable'
import { DataTable } from '@kyrobit/datatable/mui'

const table = useDataTable({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  fetchRecords: (params) => api.get('/things', { params }),
  getRowId: (row) => row.id,
})

<DataTable api={table} onRowClick={(row) => navigate(row.id)} />
```

## Client data

In client mode, `data` may be a new array on every render, such as `data={rows ?? []}` or `rows.filter(…)`: the table only filters again when the rows themselves change. Keep the row objects the same between renders; an array literal of new objects on every render counts as new data each time.

## Instant navigation

Give a server-mode table a `cacheKey` and it keeps the last result for each set of params in memory, shared by every table. A table that mounts with a cached result renders it at once, then refetches quietly in the background. Start the fetch before the click with `prefetchDataTable`, passing the same options the table mounts with:

```tsx
import { prefetchDataTable, useDataTable } from '@kyrobit/datatable'

const orders = {
  cacheKey: `orders:${organisationId}`,
  fetchRecords: (params) => api.get('/orders', { params }),
  initialSort: { field: 'created_at', direction: 'desc' },
}

<Link to="/orders" onPointerEnter={() => prefetchDataTable(orders)}>Orders</Link>

function OrdersPage() {
  const table = useDataTable({ ...orders, columns, getRowId: (row) => row.id })
  return <DataTable api={table} onRowIntent={(row) => prefetchOrder(row.id)} onRowClick={(row) => navigate(row.id)} />
}
```

The cache key must name everything the rows depend on beyond search, sort, filters and paging, such as the organisation. `onRowIntent` fires when the pointer rests on a row for about 80ms or the row takes keyboard focus, never on a pointer just passing over.

## KyroUI renderer: give the table a height

The KyroUI table takes exactly the height its parent gives it, in paged and in infinite mode. With few rows it still fills that space; with many, the rows scroll inside it under a sticky header, and the page itself never grows taller. In paged mode the pager sits below the table. In infinite mode the next page starts loading when the end of the rows is one viewport away, one request at a time, so at a normal scrolling pace it has arrived before you reach it; skeleton rows appear only if you get to the end first. With a `cacheKey`, every page loaded stays cached, so a list you return to shows all of them at the same scroll position without a request, then refreshes them one by one in the background.

The parent must be a flex column that fills the height:

```tsx
<Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
  <DataTable api={table} />
</Box>
```

Inside an app shell, the page's content area plays that role: a flex column that fills the space below the shell's header. Without such a parent, the table falls back to a minimum of four rows.

## Selection column

The checkbox column is the theme's checkbox cell in every layout, skeleton rows included, and other columns never take its room: KyroUI's `TableCell padding="checkbox"`, sized by `size.control.lg` (48px), and MUI's own `paddingCheckbox` cell in the MUI renderer. Restyle it through the theme's `TableCell` overrides, not in the table.

## Documentation

Full documentation lives in [`docs/`](./docs) (VitePress — `bun run docs:dev`): a quick start that builds a real table end to end, guides for server-side grouping, Favorites, the built-in MUI renderer, writing your own renderer, and a complete API reference.
