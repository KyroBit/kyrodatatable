# Introduction

@kyrobit/kyro-datatable answers one question: what page, sort order, search term, and expanded group is this list view in right now — and it never asks how you're drawing it on screen.

The docs run one example: a **Blog Categories** admin table. Rows have a name, a slug, an active/inactive status, and a creation date. Someone browsing it wants to search, sort by name or date, filter down to just the active ones, save that filter as a favorite, and — later, once the list gets long — group rows by status instead of scrolling through everything.

Here is the whole library in one file:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

function CategoriesPage() {
  // The hook owns every piece of state: page, sort, search, groups.
  // It calls fetchRecords whenever any of that changes.
  const table = useDataTable<Category, 'name' | 'created_at'>({
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ],
    fetchRecords: (params) => api.get('/admin/blog-categories', { params }),
    getRowId: (row) => row.id,
  })

  // The renderer just reads that state and draws it. Nothing here
  // knows or cares that MUI is the thing rendering it.
  return <DataTable api={table} columns={columns} getRowId={(row) => row.id} />
}
```

This file is a sketch, not a runnable app — see the [quick start](/guide/quick-start) for one that actually fetches data.

You call `useDataTable` once per list view. It gives you back an object — rows, loading, sort, setPage, and so on. You either hand that object to a renderer (`./mui` or `./bootstrap`), or read it yourself and draw whatever markup you want.

## The pieces

Four words cover everything this library does.

- **State** — everything `useDataTable` tracks: which page, what's sorted and which way, what's searched, which group is expanded. Lives in `@kyrobit/kyro-datatable`, the root import. See [Quick start](/guide/quick-start).
- **Renderer** — a component that reads that state and draws rows. `./mui` and `./bootstrap` ship built in; nothing stops you writing a third. See [MUI renderer](/guide/mui), [Bootstrap renderer](/guide/bootstrap), and [Writing your own renderer](/guide/custom-renderer).
- **Grouping** — collapsing rows under a shared value (like `is_active`), fetched from your server, with each group loading its own page independently when expanded. See [Server-side grouping](/guide/grouping).
- **Favorites** — named, saved filter sets a user can create, apply, and reorder — "Active categories," "Created this month," whatever your filters actually are. See [Favorites](/guide/favorites).

## Next

- [Quick start](/guide/quick-start) — wire up the Blog Categories table end to end.
- [Installation](/guide/installation) — link the package into your app.
