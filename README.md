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

## KyroUI renderer: give the table a height

The KyroUI table takes exactly the height its parent gives it, in paged and in infinite mode. With few rows it still fills that space; with many, the rows scroll inside it under a sticky header, and the page itself never grows taller. In paged mode the pager sits below the table. In infinite mode the next page loads as you near the bottom, and pages keep loading until the rows can scroll.

The parent must be a flex column that fills the height:

```tsx
<Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
  <DataTable api={table} />
</Box>
```

Inside an app shell, the page's content area plays that role: a flex column that fills the space below the shell's header. Without such a parent, the table falls back to a minimum of four rows.

## Documentation

Full documentation lives in [`docs/`](./docs) (VitePress — `bun run docs:dev`): a quick start that builds a real table end to end, guides for server-side grouping, Favorites, the built-in MUI renderer, writing your own renderer, and a complete API reference.
