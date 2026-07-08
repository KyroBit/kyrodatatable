# @kyrobit/kyro-datatable

Headless data-table state — pagination, sorting, search, and server-side grouping — fully decoupled from rendering. Bring your own markup, or use the built-in MUI `DataTable`.

## Why

`MUI X DataGrid`'s row grouping is a Premium (paid) feature. This package ports the server-side grouping pattern already proven out in-house (`epg`'s `DataTable`), but fixes its one real flaw: state was tightly bound to the rendering component, making the UI hard to restyle. Here, `useDataTable` owns 100% of the state and knows nothing about JSX; `DataTable` is just one possible renderer built on top of it.

## Two ways to use it

**1. Fully custom UI** — use the state hook directly, render however you want:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable/state'

const table = useDataTable({
  columns: [...],
  fetchRecords: (params) => api.get('/things', { params }),
  getRowId: (row) => row.id,
})
// table.rows, table.total, table.loading, table.setPage, table.toggleSort, ...
```

**2. Built-in MUI renderer**:

```tsx
import { useDataTable, DataTable } from '@kyrobit/kyro-datatable'

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

## Server-side grouping

Pass `groupByColumns` + `fetchGroups` to `useDataTable`. Groups render collapsed by default; expanding one lazily fetches that group's rows (with its own pagination) via `fetchRecords({ groupBy, groupKey, page, pageSize })`.

```tsx
useDataTable({
  columns,
  groupByColumns: [{ field: 'status', label: 'Status' }],
  fetchRecords: (params) => api.get('/things', { params }),
  fetchGroups: (params) => api.get('/things/group-by', { params }),
  getRowId: (row) => row.id,
})
```

## Status

v0.1 — core state (search, sort, pagination, grouping with lazy per-group pagination) and a default MUI renderer are implemented and typechecked. Not yet built: column-level filter UI, saved filter presets/favorites (the epg version had these; not ported yet).
