# Introduction

@kyrobit/datatable answers one question on every render: what page, sort order, search term, and expanded group is this list view in right now — and it has never once needed to know what's drawing that on screen.

The docs run one example: a **Blog Categories** admin table. Fourteen rows, a mix of active and inactive, created across a few months. Someone using it wants to search by name, sort by name or creation date, page through the results, eventually group them by status once there are enough to make paging through them annoying, and save "just the active ones" as a one-click filter they don't have to reapply every visit. Every guide after this one builds that same screen, one feature at a time, against the same 14 rows.

Here is the whole library in one file:

```tsx
import { useDataTable } from '@kyrobit/datatable'
import { DataTable } from '@kyrobit/datatable/mui'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

function CategoriesPage() {
  // The hook owns every piece of state: page, sort, search, groups.
  const table = useDataTable({
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ],
    fetchRecords: (params) =>
      api.get<{ data: Category[]; total: number }>('/admin/blog-categories', { params }).then((r) => r.data),
    getRowId: (row) => row.id,
  })

  // The renderer just reads `table` and draws it. Nothing here
  // knows or cares that MUI is the thing rendering it.
  return <DataTable api={table} />
}
```

This file is a sketch, not a runnable app — the [quick start](/guide/quick-start) is the runnable version, with a real in-memory dataset standing in for `api.get`, so there's nothing to set up before seeing it actually search, sort, and paginate.

Row grouping is free here — MUI X DataGrid gates it behind a paid Premium license.

## The pieces

Five words cover everything this library does.

- **State** — everything `useDataTable` tracks: which page, what's sorted and which way, what's searched and filtered, which group is expanded. Lives in the root import, `@kyrobit/datatable` — nothing in that import has ever imported a UI library. See [Quick start](/guide/quick-start).
- **Client or server** — pass `data: Row[]` and everything runs in memory, or pass `fetchRecords`/`fetchGroups` and everything runs against your API. Same `table` object either way — a renderer, or your own code reading `table`, can't tell which mode is behind it. See [Quick start](/guide/quick-start).
- **Renderer** — a component that reads that state and draws rows. `./mui` ships built in as composable pieces (`DataTable.Root`, `.SearchField`, `.Body`, `.Pagination`, ...) with `<DataTable/>` as its default assembly — use the assembly, or compose the pieces into your own layout. Nothing stops you writing a whole new renderer for a different design system either. See [MUI renderer](/guide/mui) and [Writing your own renderer](/guide/custom-renderer).
- **Grouping** — collapsing rows under a shared value (like `is_active`), with each group loading its own page independently once it's actually expanded — never before. Works in both client and server mode; client mode groups automatically from `data`, no extra config. See [Server-side grouping](/guide/grouping).
- **Favorites** — named, saved filter sets a user creates, applies, and reorders — "Active categories," "Created this month," whatever your filters actually are, since the library never assumes a filter's shape beyond the generic `filters`/`setFilters` slot on `table`. See [Favorites](/guide/favorites).

## Next

- [Quick start](/guide/quick-start) — build the Blog Categories table end to end, with a real dataset, no backend required.
- [Installation](/guide/installation) — link the package into your real app once you've seen it work.
