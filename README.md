# @kyrobit/kyro-datatable

Headless data-table state — pagination, sorting, search, server-side grouping, and saved filter presets ("Favorites") — fully decoupled from rendering. Same shape as `@kyrobit/kyroguard`: a UI-agnostic core, with optional adapters for whichever library you're actually using.

`useDataTable` owns 100% of the state and has never imported a UI library. `./mui` and `./bootstrap` are both just components that read that state and draw markup — neither is required, and neither is special. Write a third the same way if you need one.

## Why

MUI X DataGrid's server-side row grouping sits behind the **Premium** license — not included in Community, not included in Pro. This library ports the grouping pattern already proven out in-house (`epg`'s `DataTable`), fixing the one real problem with it: state was welded to the render component, so restyling meant rewriting logic.

## Install

Not published to a registry — link it locally, same as `@kyrobit/kyroguard`:

```bash
cd kyro-datatable && bun run build && bun link
cd your-app && bun link @kyrobit/kyro-datatable
```

`react`/`react-dom` are required peers. `@mui/material` is **optional** — only resolved via `./mui`. `./bootstrap` needs no npm package at all, just your app's own Bootstrap CSS.

## At a glance

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'

const table = useDataTable({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  fetchRecords: (params) => api.get('/things', { params }),
  getRowId: (row) => row.id,
})

<DataTable api={table} columns={columns} getRowId={(row) => row.id} onRowClick={(row) => navigate(row.id)} />
```

## Documentation

Full documentation lives in [`docs/`](./docs) (VitePress — `bun run docs:dev`): a quick start that builds a real table end to end, guides for server-side grouping, Favorites, both built-in renderers, writing your own renderer, and a complete API reference.
