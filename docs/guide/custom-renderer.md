# Writing your own renderer

Neither MUI nor Bootstrap your design system? `useDataTable` was built so this is a normal thing to do, not an escape hatch you're not really supposed to reach for.

## The contract

A renderer reads a `DataTableApi<Row, Field, Filters>` — the object `useDataTable()` returns — and draws it. `table.columns` and `table.getRowId` are already on that object (see [Quick start](/guide/quick-start)), so a renderer never needs them passed in separately.

## A complete one, including grouping, in about 70 lines

In Tailwind, handling both the flat list and grouping:

```tsx
import type { DataTableApi } from '@kyrobit/kyro-datatable'
import type { Category } from './categories'

function TailwindDataTable<Row, Field extends string>({
  api, onRowClick,
}: {
  api: DataTableApi<Row, Field>
  onRowClick?: (row: Row) => void
}) {
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
            {api.groupBy && <th className="w-8" />}
            {api.columns.map((col) => (
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
          {api.visibleItems.length === 0 ? (
            <tr><td colSpan={api.columns.length + 1} className="py-6 text-center text-slate-400">No results.</td></tr>
          ) : (
            api.visibleItems.map((item) => {
              if (item.type === 'group') {
                return (
                  <tr key={`g-${item.group.key}`} className="cursor-pointer bg-slate-50 font-medium" onClick={() => api.toggleGroup(item.group.key)}>
                    <td className="px-3 py-2" colSpan={api.columns.length + 1}>
                      {item.expanded ? '▼' : '▶'} {item.group.label} ({item.group.count})
                    </td>
                  </tr>
                )
              }
              const row = item.row
              return (
                <tr key={api.getRowId(row)} className="border-b hover:bg-slate-50" onClick={() => onRowClick?.(row)}>
                  {item.type === 'group-row' && <td className="w-8" />}
                  {api.columns.map((col) => (
                    <td key={col.field} className="px-3 py-2">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.field])}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {!api.groupBy && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{api.total} total</span>
          <div className="flex gap-2">
            <button disabled={api.pagination.page <= 1} onClick={() => api.setPage(api.pagination.page - 1)} className="disabled:opacity-40">Previous</button>
            <button disabled={api.pagination.page * api.pagination.pageSize >= api.total} onClick={() => api.setPage(api.pagination.page + 1)} className="disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

Drop this in place of `<DataTable/>` — same `table` from any guide in these docs, client mode or server mode, grouped or not, nothing about `useDataTable`'s call changes:

```tsx
<TailwindDataTable api={table} onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)} />
```

## Why `api.visibleItems` is what makes this manageable

Without it, drawing a grouped table means nesting a rows-loop inside a groups-loop, hand-tracking where each group's rows insert relative to the group header, and switching between that structure and a plain flat map depending on `api.groupBy`. `visibleItems` does that interleaving once, inside the state layer, and hands back a single array in the exact order things should appear on screen — a flat `{ type: 'row' }` list when ungrouped, or a mix of `{ type: 'group' }` and `{ type: 'group-row' }` items when grouped. The renderer above never branches on "am I grouped" except to decide whether to show pagination — the table body itself is one `.map()`, one `switch`-like `if (item.type === 'group')`, regardless.

This is also exactly what `./mui`'s and `./bootstrap`'s own `DataTable.Body` do internally — reading their source (`src/renderers/mui/Body.tsx`, `src/renderers/bootstrap/Body.tsx`) is the fastest way to see a second, fuller implementation of the same pattern, including loading states per group.

## Publishing it back into the library

If you build one worth reusing across projects rather than keeping it local to one app:

1. `src/renderers/<name>/` with the same piece breakdown as `./mui` — `context.tsx` (the `Root` provider + `useDataTableContext`), `SearchField.tsx`, `GroupBySelect.tsx`, `Body.tsx`, `Pagination.tsx`, `DataTable.tsx` (the default assembly, with the pieces attached as static properties), `index.ts`.
2. A subpath in `package.json`'s `exports`:
   ```json
   "./tailwind": {
     "types": "./dist/renderers/tailwind/index.d.ts",
     "default": "./dist/renderers/tailwind/index.js"
   }
   ```
3. Any new UI dependency it needs goes in **both** `peerDependencies` and `peerDependenciesMeta` with `optional: true` — someone using `./mui` should never be forced to install Tailwind because a sibling subpath needs it.
