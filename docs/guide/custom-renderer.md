# Writing your own renderer

Neither MUI nor Bootstrap your design system? `useDataTable` was built so this is a normal thing to do, not an escape hatch you're not really supposed to reach for.

## The contract

A renderer is a component that takes a `DataTableApi<Row, Field>` — the exact object `useDataTable()` returns — and a `ColumnDef<Row, Field>[]`, and draws rows. Nothing about the state layer changes because you're rendering it differently; every interaction (search, sort, page, group) is already implemented, driven entirely by calling methods already on `api`.

## A minimal one, built against the Blog Categories example

This is the smallest useful renderer — no grouping, no favorites, just the flat list with sortable headers and a search box, in Tailwind instead of MUI or Bootstrap:

```tsx
import type { DataTableApi, ColumnDef } from '@kyrobit/kyro-datatable'
import type { Category } from './categories'

interface TailwindDataTableProps<Row, Field extends string> {
  api: DataTableApi<Row, Field>
  columns: ColumnDef<Row, Field>[]
  getRowId: (row: Row) => string
  onRowClick?: (row: Row) => void
}

function TailwindDataTable<Row, Field extends string>({
  api, columns, getRowId, onRowClick,
}: TailwindDataTableProps<Row, Field>) {
  return (
    <div className="flex flex-col gap-3">
      <input
        className="rounded border px-3 py-1.5 text-sm"
        placeholder="Search…"
        value={api.search}
        onChange={(e) => api.setSearch(e.target.value)}
      />

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-500">
            {columns.map((col) => (
              <th
                key={col.field}
                className={col.sortable === false ? 'px-3 py-2' : 'cursor-pointer px-3 py-2'}
                onClick={col.sortable === false ? undefined : () => api.toggleSort(col.field)}
              >
                {col.headerName}
                {api.sort?.field === col.field && (api.sort.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {api.loading && api.rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-6 text-center text-slate-400">Loading…</td></tr>
          ) : api.rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-6 text-center text-slate-400">No results.</td></tr>
          ) : (
            api.rows.map((row) => (
              <tr key={getRowId(row)} className="border-b hover:bg-slate-50" onClick={() => onRowClick?.(row)}>
                {columns.map((col) => (
                  <td key={col.field} className="px-3 py-2">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.field])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{api.total} total</span>
        <div className="flex gap-2">
          <button
            disabled={api.pagination.page <= 1}
            onClick={() => api.setPage(api.pagination.page - 1)}
            className="disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={api.pagination.page * api.pagination.pageSize >= api.total}
            onClick={() => api.setPage(api.pagination.page + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
```

Drop this in place of `<DataTable />` from the [quick start](/guide/quick-start) — same `table` object, same `fetchCategories`, nothing about `useDataTable`'s call changes:

```tsx
<TailwindDataTable api={table} columns={columns} getRowId={(row) => row.id} />
```

Search, sort, and pagination all work the moment this renders — not because this component is especially clever, but because none of that logic lives here. It's about 60 lines because most of what a data table needs to *do* already happened before this component was ever called.

## Adding grouping to a custom renderer

This is the part worth reading `./mui`'s or `./bootstrap`'s source for rather than reinventing from the prose here — `src/renderers/mui/DataTable.tsx` and `src/renderers/bootstrap/DataTable.tsx` both implement the group-row expand/collapse pattern against the same `DataTableApi`, one with MUI's `Collapse`, one with plain conditional rendering. The shape is the same either way:

```tsx
{api.groupBy ? (
  api.groups.map((group) => (
    <>
      <tr onClick={() => api.toggleGroup(group.key)}>
        <td>{api.isGroupExpanded(group.key) ? '▼' : '▶'} {group.label} ({group.count})</td>
      </tr>
      {api.isGroupExpanded(group.key) && (
        api.groupLoading(group.key) && api.groupRows(group.key).length === 0
          ? <tr><td>Loading…</td></tr>
          : api.groupRows(group.key).map((row) => <tr key={getRowId(row)}>{/* ... */}</tr>)
      )}
    </>
  ))
) : (
  api.rows.map((row) => <tr key={getRowId(row)}>{/* ... */}</tr>)
)}
```

## Publishing it back into the library

If you build one worth reusing across projects rather than keeping it local to one app:

1. `src/renderers/<name>/DataTable.tsx` implementing the same `DataTableProps<Row, Field>` shape as `./mui`.
2. `src/renderers/<name>/index.ts` re-exporting it (and `FavoritesMenu`, if you build one).
3. A subpath in `package.json`'s `exports`:
   ```json
   "./tailwind": {
     "types": "./dist/renderers/tailwind/index.d.ts",
     "default": "./dist/renderers/tailwind/index.js"
   }
   ```
4. Any new UI dependency it needs goes in **both** `peerDependencies` and `peerDependenciesMeta` with `optional: true` — someone using `./mui` should never be forced to install Tailwind because a sibling subpath needs it. This is exactly how `@mui/material` itself is set up for `./mui` — see [Installation](/guide/installation).
