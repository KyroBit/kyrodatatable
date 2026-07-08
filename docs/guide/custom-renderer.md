# Writing your own renderer

Neither MUI nor Bootstrap your design system? `useDataTable` was built so this is a normal thing to do, not an escape hatch.

## The contract

A renderer is a component that takes a `DataTableApi<Row, Field>` — the exact object `useDataTable()` returns — and a `ColumnDef<Row, Field>[]`, and draws rows. Nothing about the state layer changes because you're rendering it differently.

```tsx
import type { DataTableApi, ColumnDef } from '@kyrobit/kyro-datatable'

interface DataTableProps<Row, Field extends string> {
  api: DataTableApi<Row, Field>
  columns: ColumnDef<Row, Field>[]
  getRowId: (row: Row) => string
  onRowClick?: (row: Row) => void
}

function TailwindDataTable<Row, Field extends string>({ api, columns, getRowId, onRowClick }: DataTableProps<Row, Field>) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.field} className="cursor-pointer px-3 py-2 text-left" onClick={() => api.toggleSort(col.field)}>
              {col.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {api.rows.map((row) => (
          <tr key={getRowId(row)} className="hover:bg-slate-50" onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={col.field} className="px-3 py-2">
                {col.render ? col.render(row) : String((row as any)[col.field])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

That's a working renderer — search, sort, and refetch already work, because they were never the renderer's job. It's about 25 lines because most of what a data table needs to *do* already happened in `useDataTable`.

## Fuller example: reuse `./mui`'s structure

`./mui`'s and `./bootstrap`'s own source (`src/renderers/mui/DataTable.tsx`, `src/renderers/bootstrap/DataTable.tsx`) is the real reference — both implement search, sortable headers, the group-by control, expandable grouped rows with `Collapse`, and pagination against the same `DataTableApi`. Reading either top to bottom is the fastest way to see every piece of state the hook exposes actually get used.

## Publishing it back

If you build one worth reusing:

1. `src/renderers/<name>/DataTable.tsx` implementing the same `DataTableProps<Row, Field>` shape.
2. `src/renderers/<name>/index.ts` re-exporting it.
3. A subpath in `package.json`'s `exports`: `"./tailwind": { "types": "./dist/renderers/tailwind/index.d.ts", "default": "./dist/renderers/tailwind/index.js" }`.
4. Any new UI dependency it needs goes in `peerDependencies` **and** `peerDependenciesMeta` with `optional: true` — nobody using `./mui` should be forced to install Tailwind.
