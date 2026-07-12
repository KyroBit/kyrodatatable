# @kyrobit/datatable

Headless data-table state — pagination, sorting, search, filtering, grouping (client-side or server-side), and saved filter presets ("Favorites") — fully decoupled from rendering. A UI-agnostic core, with optional renderers for whichever library you're actually using.

`useDataTable` owns 100% of the state and has never imported a UI library. `./mui` and `./bootstrap` are both just components that read that state and draw markup — neither is required, and neither is special. Write a third the same way if you need one.

## Why

MUI X DataGrid's server-side row grouping sits behind the **Premium** license — not included in Community, not included in Pro. It's free and built in here.

## Install

Not published to a registry — link it locally:

```bash
cd kyro-datatable && bun run build && bun link
cd your-app && bun link @kyrobit/datatable
```

`react`/`react-dom` are required peers. `@mui/material` is **optional** — only resolved via `./mui`. `./bootstrap` needs no npm package at all, just your app's own Bootstrap CSS.

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

## Documentation

Full documentation lives in [`docs/`](./docs) (VitePress — `bun run docs:dev`): a quick start that builds a real table end to end, guides for server-side grouping, Favorites, both built-in renderers, writing your own renderer, and a complete API reference.
