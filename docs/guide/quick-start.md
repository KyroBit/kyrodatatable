# Quick start

This builds the Blog Categories table from the [introduction](/guide/introduction) into something that actually fetches data, start to finish.

## 1. Shape your row type

```ts
interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}
```

## 2. Write a fetch function

`useDataTable` doesn't know how you talk to your server — you hand it a function. It's called with the current page, page size, search term, and sort, and must return `{ rows, total }`.

```ts
import { api } from '@/lib/api'
import type { FetchParams, FetchResult } from '@kyrobit/kyro-datatable'

async function fetchCategories(
  params: FetchParams<'name' | 'created_at'>,
): Promise<FetchResult<Category>> {
  const { data } = await api.get<{ data: Category[]; total: number }>('/admin/blog-categories', {
    params: { q: params.search, sort: params.sort?.field, dir: params.sort?.direction },
  })
  return { rows: data.data, total: data.total }
}
```

## 3. Call the hook

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'

const table = useDataTable<Category, 'name' | 'created_at'>({
  columns: [
    { field: 'name', headerName: 'Name' },
    { field: 'slug', headerName: 'Slug' },
    { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ],
  fetchRecords: fetchCategories,
  getRowId: (row) => row.id,
  initialSort: { field: 'created_at', direction: 'desc' },
})
```

`table` now has `rows`, `total`, `loading`, `sort`, `pagination` — and setters for all of it. It already fetched page 1, sorted by `created_at` descending, the moment this ran.

## 4. Render it

With the MUI renderer:

```tsx
import { DataTable } from '@kyrobit/kyro-datatable/mui'

<DataTable
  api={table}
  columns={columns}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)}
/>
```

That's search, sortable column headers, a table, and pagination — all wired up. Type into the search box, click a column header, change the page: `fetchCategories` runs again automatically with the new params.

## What you get without writing more code

- `table.setSearch(value)` — resets to page 1, refetches.
- `table.toggleSort('name')` — asc → desc → unsorted, cycling on repeated clicks.
- `table.setPage(2)`, `table.setPageSize(50)`.
- `table.refetch()` — call this after a mutation (you just deleted a row, created one, edited one).

## Next

- [Server-side grouping](/guide/grouping) — collapse rows by status, lazy-load each group's page on expand.
- [Favorites](/guide/favorites) — let users save "Active categories" as a one-click filter.
- [MUI renderer](/guide/mui) or [Bootstrap renderer](/guide/bootstrap) — the full prop reference for what you just used.
