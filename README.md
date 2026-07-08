# @kyrobit/kyro-datatable

Headless data-table state — pagination, sorting, search, and server-side grouping — fully decoupled from rendering. Same shape as `@kyrobit/kyroguard`: a UI-agnostic core, with optional adapters for whichever library you're actually using.

## Why

`MUI X DataGrid`'s row grouping is a Premium (paid) feature. This package ports the server-side grouping pattern already proven out in-house (`epg`'s `DataTable`), but fixes its one real flaw: state was tightly bound to the rendering component, making the UI hard to restyle. Here, `useDataTable` (the root export) owns 100% of the state and knows nothing about JSX or any UI library. Everything under `./mui` and `./bootstrap` is optional — pull in whichever one you use, or none at all and render fully custom markup off the state hook.

## Install

```
bun add @kyrobit/kyro-datatable
```

`react`/`react-dom` are required peers. `@mui/material` is an **optional** peer — only needed if you use the `./mui` renderer. The `./bootstrap` renderer needs no npm package at all, just your app's own Bootstrap CSS loaded globally (it renders plain HTML with Bootstrap utility classes, no `bootstrap`/`react-bootstrap` JS dependency).

## Three ways to use it

**1. Fully custom UI** — use the state hook directly (root import), render however you want:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'

const table = useDataTable({
  columns: [...],
  fetchRecords: (params) => api.get('/things', { params }),
  getRowId: (row) => row.id,
})
// table.rows, table.total, table.loading, table.setPage, table.toggleSort, ...
```

**2. Built-in MUI renderer** (`./mui`):

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'

const table = useDataTable({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  fetchRecords: (params) => fetchThings(params),
  getRowId: (row) => row.id,
})

<DataTable api={table} columns={columns} getRowId={(row) => row.id} onRowClick={(row) => navigate(row.id)} />
```

**3. Built-in Bootstrap renderer** (`./bootstrap`) — identical `DataTable` props, plain Bootstrap-classed markup instead of MUI components:

```tsx
import { DataTable } from '@kyrobit/kyro-datatable/bootstrap'

<DataTable api={table} columns={columns} getRowId={(row) => row.id} />
```

## Server-side grouping

Pass `groupByColumns` + `fetchGroups` to `useDataTable`. Groups render collapsed by default; expanding one lazily fetches that group's rows (with its own pagination) via `fetchRecords({ groupBy, groupKey, page, pageSize })`. Works identically regardless of which renderer (or none) you use, since it's state, not UI.

```tsx
useDataTable({
  columns,
  groupByColumns: [{ field: 'status', label: 'Status' }],
  fetchRecords: (params) => api.get('/things', { params }),
  fetchGroups: (params) => api.get('/things/group-by', { params }),
  getRowId: (row) => row.id,
})
```

## Adding a renderer for another UI library

Each renderer is just a component consuming `DataTableApi<Row, Field>` (the object `useDataTable` returns) — nothing renderer-specific leaks into the state layer. To add e.g. an Ant Design or Tailwind renderer, create `src/renderers/<name>/DataTable.tsx` implementing the same `DataTableProps<Row, Field>` contract as `./mui`/`./bootstrap`, add a subpath in `package.json`'s `exports`, and mark any new peer dependency `optional: true` in `peerDependenciesMeta`.

## Status

v0.1 — core state (search, sort, pagination, grouping with lazy per-group pagination) plus MUI and Bootstrap renderers are implemented and typechecked. Not yet built: column-level filter UI, saved filter presets/favorites (the `epg` version had these; not ported yet).
